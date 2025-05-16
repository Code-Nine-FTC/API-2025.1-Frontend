import { Box } from "@mui/material";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/boost';

// console.log('Imported boost module:', boost);
// console.log('Type of boost module:', typeof boost);

// if (typeof boost === 'function') {
//   boost(Highcharts);
// } else {
//   console.error('Failed to initialize Highcharts boost module: `boost` is not a function.', boost);
// }


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

  let minTimestampMs: number | undefined = undefined;
  let maxTimestampMs: number | undefined = undefined;

  if (props.measure && props.measure.length > 0) {
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
    credits: {
      enabled: false,
    },
    navigator: { 
      enabled: true
    },
    scrollbar: { 
      enabled: true
    },
    rangeSelector: { 
      buttons: [{
           type: 'month',
           count: 1,
           text: '1m'
       }, {
           type: 'month',
           count: 3,
           text: '3m'
       }, {
           type: 'month',
           count: 6,
           text: '6m'
       }, {
           type: 'ytd',
           text: 'YTD'
       }, {
           type: 'year',
           count: 1,
           text: '1a'
       }, {
           type: 'all',
           text: 'Todos'
       }],
       selected: 5
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
      series: {
        findNearestPointBy: 'xy',
        dataGrouping: {
          enabled: true,
          forced: true,
          approximation: 'average',
          groupPixelWidth: 10,
          units: [
            ['day', [1]],
            ['hour', [1]],
            ['minute', [1]],
            ['second', [1]],
          ],
        }
      },
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
      <HighchartsReact highcharts={Highcharts} options={options} constructorType={'stockChart'}/>
    </Box>
  );
};