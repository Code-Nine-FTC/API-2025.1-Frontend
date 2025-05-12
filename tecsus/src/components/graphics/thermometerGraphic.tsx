import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';
import { Height } from '@mui/icons-material';

interface ThermometerGraphicProps {
    min: number;
    max: number;
    value: number;
    title: string;
    unit: string;
    plotLines?: {
        value: number;
        label: string;
    }[];
}

export default function ThermometerGraphic(props: ThermometerGraphicProps) {
    const chartOptions = {
        chart: {
            type: 'solidgauge',
            backgroundColor: 'transparent',
            height: 280,
        },
        title: {
            text: props.title,
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
            },
            y: 5
        },
        credits: {enabled: false},
        pane: {
            center: ['50%', '70%'],
            size: '100%',
            startAngle: -90,
            endAngle: 90,
            background: [{ 
                outerRadius: '100%', // Outer edge of the glass
                innerRadius: '85%',  // Inner edge of the glass, creating the tube wall
                backgroundColor: 'rgba(204, 204, 204, 0.3)', // Semi-transparent glass color
                borderWidth: 1,
                borderColor: '#cccccc',
                shape: 'arc',
                // borderRadius: 20, // For rounded ends of the glass tube itself (might need newer Highcharts)
            }],
        },
        tooltip: {
            enabled: true,
            pointFormat: '{series.name}: <b>{point.y:.1f}</b>{point.series.userOptions.unit}',
        },
        yAxis: {
            min: props.min,
            max: props.max,
            stops: [
            [0.2, '#55BF3B'], // verde
            [0.4, '#DDDF0D'], // amarelo
            [0.6, '#DF5353'], // vermelho
            ],
            lineWidth: 0,
            tickPositions: [],
            minorTickInterval: null,
            title: { text: null },
            labels: { enabled: false }, // Hide y-axis numeric labels for a cleaner thermometer
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: true,
                    y: -15, // Position data label slightly above the gauge's top
                    borderWidth: 0,
                    useHTML: true,
                    format: `<div style="text-align:center;">
                                <span style="font-size:1.4em; font-weight:bold;">{y:.1f}</span>
                                <span style="font-size:0.8em;">{series.userOptions.unit}</span>
                             </div>`,
                    style: {
                        color: '#333333', // Consistent color for the label
                    }
                },
                linecap: 'round',   // Rounded end for the liquid column
                stickyTracking: false,
                rounded: true,      // Rounded path for the gauge
            },
        },
        series: [
            {
            type: 'solidgauge',
            name: props.title,
            data: [props.value],
            // dataLabels: {
            //     enabled: true,
            //     format: '{y}' + props.unit,
            //     style: {
            //     fontSize: '24px',
            //     fontWeight: 'bold',
            //     color: '#333',
            //     },
            // },
            radious: '100%',
            innerRadious: '85%',
            // tooltip: {
            //     valueSuffix: props.unit || '',
            // },
            },
        ],
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    );
}