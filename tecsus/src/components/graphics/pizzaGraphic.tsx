// import { PieChart } from "@mui/x-charts/PieChart";
// import { useEffect, useMemo, useRef, useState } from "react";

// interface props {
//     data: { label: string; value: number }[];
// }

// export default function PizzaGraphic(props: props) {
//     const ref = useRef<HTMLDivElement>(null);
//     const [width, setWidth] = useState(400);
    
//     useEffect(() => {
//         function handleResize() {
//             if (ref.current) setWidth(ref.current.offsetWidth);
//         }
//         handleResize();
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);
    
//     const totalSum = useMemo(() => {
//         return props.data.reduce((sum, item) => sum + item.value, 0);
//     }, [props.data]);
    
//     const margin =
//         width < 500
//             ? { top: 10, right: 10, left: 10, bottom: 80 }
//             : { top: 10, right: 220, left: 30, bottom: 10 };

//     const legendDirection = width < 500 ? "row" : "column";
    
//     const legendPosition =
//         width < 500
//             ? { vertical: "bottom", horizontal: "middle" } as const
//             : { vertical: "middle", horizontal: "right" } as const;

//     return (
//         <div ref={ref} style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
//             <PieChart
//                 series={[
//                     {
//                         data: props.data,
//                         highlightScope: { fade: 'global', highlight: 'item' },
//                         faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
//                         valueFormatter: (item) => {
//                             if (totalSum === 0) return "0%";
//                             const percentage = (item.value / totalSum) * 100;
//                             return `${percentage.toFixed(2)}%`;
//                         },
//                     },
//                 ]}                    
//                 width={width}
//                 height={Math.round(width * 0.75)}
//                 sx={{
//                 }}
//                 margin={margin}
                
//                 slotProps={{
//                     legend: {
//                         direction: legendDirection,
//                         position: legendPosition,
//                         padding: -10,
//                         labelStyle: {
//                             fontSize: "1rem",
//                         },
//                     }
//                 }}
//             />
//         </div>
//     );

// }

import { Box } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface PizzaGraphProps {
    data : { name: string; y: number }[];
    title?: string;
}

export default function PizzaGraphic(props: PizzaGraphProps) {
    const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: {
      text: props.title,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f} %',
        },
        showInLegend: true,
      },
    },
    credits: { enabled: false },
    series: [
      {
        name: props.title,
        colorByPoint: true,
        data: props.data,
        type: 'pie',
      } as Highcharts.SeriesPieOptions,
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            // plotOptions: {
            //   pie: {
            //     dataLabels: {
            //       enabled: false,
            //     },
            //   },
            // },
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  };

  return (
    <Box sx={{ 
        width: '100%', 
        height: '400px', 
        margin: '0 auto' 
    }}>
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options}
        />
    </Box>
  );
};