import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';

interface GaugeGraphicProps {
    value: number;
    title?: string;
    min?: number;
    max?: number;
    unit?: string;
    plotLines?: {
        value: number;
        label: string;
    }[];
    measureDate: string;
}


export default function GaugeGraphic(props: GaugeGraphicProps) {
    const chartOptions: Highcharts.Options = {
    chart: {
      type: 'solidgauge',
      backgroundColor: 'transparent',
      height: '350px',
      style: { fontFamily: 'Segoe UI, sans-serif' },
    },
    title: {
      text: `${props.title} (${props.unit})`,
      style: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#2c3e50',
      },
      y: 35
    },
    subtitle: {
        text: props.measureDate
            ? new Date(Number(props.measureDate) * 1000).toLocaleString()
            : '',
        style: {
            fontSize: '14px',
            color: '#666',
        },
        y: 60,
    },
    credits: { enabled: false },
    pane: {
      startAngle: -90,
      endAngle: 90,
      center: ['50%', '75%'],
      size: '100%',
      background: [
        {
          outerRadius: '100%',
          innerRadius: '75%',
          shape: 'arc',
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#cccccc'],
              [1, '#e8e8e8'],
            ],
          } as any,
          borderWidth: 0,
          borderRadius: '50%',
        },
      ],
    },
    yAxis: {
      min: props.min,
      max: props.max,
      lineWidth: 0,
      tickPositions: [],
      stops: [
        [0.0, '#ff7875'],
        [0.3, '#ffc069'],
        [0.5, '#91d5ff'],
        [0.7, '#95de64'],
        [1.0, '#52c41a'],
      ],
      labels: { enabled: false },
      plotLines: props.plotLines && props.plotLines.length > 0
        ? props.plotLines.map((plotLine) => ({
            value: plotLine.value,
            color: '#34495e',
            width: 3,
            zIndex: 5,
            dashStyle: 'Solid',
            label: {
              text: plotLine.label,
              align: 'center',
              y: -10,
              style: {
                color: '#34495e',
                fontSize: '12px',
                fontWeight: '600',
              },
            },
          }))
          : [],
    },
    plotOptions: {
      solidgauge: {
        linecap: 'round',
        rounded: true,
        dataLabels: {
          enabled: true,
          y: -20,
          borderWidth: 0,
          useHTML: true,
          format: `
            <div style="text-align:center;">
              <span style="font-size:2.8em; font-weight:600; color:#2f3542; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">{y}</span><br/>
              <span style="font-size:1.1em; color:#888">${props.unit}</span>
            </div>`,
        },
        animation: {
          duration: 800,
          easing: 'easeOutBounce',
        },
      },
    },
    series: [
      {
        name: 'Valor',
        type: 'solidgauge',
        data: [props.value],
        tooltip: {
          valueSuffix: ` ${props.unit}`,
          style: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#2c3e50',
          },
        },
        innerRadius: '75%',
        radius: '100%',
      } as Highcharts.SeriesSolidgaugeOptions,
    ],
    responsive: {
      rules: [
        {
          condition: { maxWidth: 600 },
          chartOptions: {
            title: {
              style: { fontSize: '16px' },
            },
            pane: { size: '100%', center: ['50%', '80%'] },
          },
        },
        {
          condition: { minWidth: 1200 },
          chartOptions: {
            title: {
                y: 0,
            },
        },
    },  
    ]}
};

    
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    );

};