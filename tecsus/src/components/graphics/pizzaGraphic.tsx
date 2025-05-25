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
          enabled: false,
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
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: false,
                },
              },
            },
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