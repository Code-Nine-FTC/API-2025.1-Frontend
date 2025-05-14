// import { LineChart } from '@mui/x-charts/LineChart';
// import { useEffect, useRef, useState } from 'react';

import { Box } from "@mui/material";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import boost from 'highcharts/modules/boost';

// interface DataPoint {
//   name: string;
//   value: number;
//   measure_unit: string;
//   measure_date: number;
// }

// interface StationHistoricProps {
//   data: DataPoint[];
// }

// export const StationHistoric = ({ data }: StationHistoricProps) => {
//       const allDates = [...new Set(data.map(item => item.measure_date * 1000))].sort((a, b) => a - b);
      
//       const grouped = data.reduce((acc, item) => {
//         if (!acc[item.name]) acc[item.name] = {};
//         acc[item.name][item.measure_date * 1000] = Number(item.value.toFixed(2));
//         return acc;
//       }, {} as Record<string, Record<number, number>>);

//       const series = Object.entries(grouped).map(([name, values]) => ({
//         label: name,
//         data: allDates.map(date => values[date] ?? null), 
//         showMark: false,
//       }));
                  
//       const ref = useRef<HTMLDivElement>(null);
//       const [width, setWidth] = useState(800);
      
//       useEffect(() => {
//         function handleResize() {
//           if (ref.current) setWidth(ref.current.offsetWidth);
//         }
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//       }, []);
    
//       return (
//         <div ref={ref} style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
//           <LineChart
//             series={series}
//             width={width}
//             height={Math.round(width * 0.5)}
//             margin={{bottom: 70}}
//             xAxis={[{
//               data: allDates,
//               scaleType: 'time',
//               valueFormatter: (value) => new Date(value).toLocaleDateString('pt-BR')
//             }]}
//             slotProps={{
//               legend: {
//                 direction: 'row',
//                 position: { vertical: 'bottom', horizontal: 'middle' },
//               },
//             }}
//             sx={{
//               '.MuiLineElement-root': {
//                 strokeWidth: 2,
//               },
//               overflowX: 'scroll',
//             }}
//           />
//         </div>
//       );
//     };

interface LineGraphicProps {
  measure: {
    value: number;
    measure_unit: string;
    measure_date: number;
    type: string;
  }[];
  title: string;
}

export default function LineGraphic (props: LineGraphicProps) {

  boost(Highcharts);

  let minTimestampMs: number | undefined = undefined;
  let maxTimestampMs: number | undefined = undefined;

  if (props.measure && props.measure.length > 0) {
    // Initialize with the first point's date (converted to ms)
    minTimestampMs = props.measure[0].measure_date * 1000;
    maxTimestampMs = props.measure[0].measure_date * 1000;

    for (const point of props.measure) {
      const currentTimestampMs = point.measure_date * 1000;
      if (currentTimestampMs < minTimestampMs) {
        minTimestampMs = currentTimestampMs;
      }
      if (currentTimestampMs > maxTimestampMs) {
        maxTimestampMs = currentTimestampMs;
      }
    }
  }

  const groupedData = props.measure.reduce((acc, { measure_date, value, type, measure_unit }) => {
    if (!acc[type]) {
      acc[type] = { name: `${type} (${measure_unit})`, type: 'line', data: [] };
    }
    acc[type].data.push([measure_date * 1000, value]);
    return acc;
  }, {} as Record<string, { name: string; type: 'line', data: [number, number][] }>);
  
  const series = Object.values(groupedData);
  
  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      zoomType: 'x',
    } as Highcharts.ChartOptions,
    title: {
      text: props.title,
    },
    boost: {
      useGPUTranslations: true,
    },

    xAxis: {
      type: 'datetime',
      min: minTimestampMs,
      max: maxTimestampMs,
      title: {
        text: 'Dados',
      },
      tickPixelInterval: 150,
    },
    yAxis: {
      title: {
        text: 'Valor',
      },
      startOnTick: false,
      endOnTick: false,
    },
    legend: {
      enabled: true,
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      xDateFormat: '%A, %b %e, %Y, %H:%M',
    } as Highcharts.TooltipOptions,
    plotOptions: {
      line: {
        marker: {
          enabled: false,
        },
        turboThreshold: 5000, 
      },
    },
    series,
  };

  return (
    <Box style={{ width: '100%', height: '500px', margin: '0 auto' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
};