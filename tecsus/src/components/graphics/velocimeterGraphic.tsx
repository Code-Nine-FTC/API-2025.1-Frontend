import Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';

interface VelocimeterGraphicProps {
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

export default function VelocimeterGraphic (props: VelocimeterGraphicProps) {
    const options: Highcharts.Options = {
        chart: {
            type: 'gauge',
            height: '350px',
            },
            title: {
                text: props.title,
                style: {
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2c3e50',
                },
                y: 35,
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
            pane: {
                center: ['50%', '75%'],
                startAngle: -90,
                endAngle: 90,
                background: [
                    {
                    outerRadius: '100%',
                    innerRadius: '60%',
                    backgroundColor: '#EEE',
                    borderWidth: 0,
                    shape: 'arc',
                    },
                ],
            },
            yAxis: {
                min: props.min,
                max: props.max,
                tickInterval: 20,
                labels: {
                    distance: -20,
                    rotation: 0,
                },
                title: {
                    text: props.unit,
                    y: -40,
                },
                plotBands: [
                    {
                    from: 0,
                    to: 40,
                    color: '#55BF3B', // Verde
                    },
                    {
                    from: 40,
                    to: 70,
                    color: '#DDDF0D', // Amarelo
                    },
                    {
                    from: 70,
                    to: 100,
                    color: '#DF5353', // Vermelho
                    },
                ],
            },
            series: [
            {
                name: props.title,
                data: [props.value],
                tooltip: {
                valueSuffix: ` ${props.unit}`,
                },
                type: 'gauge',
            },
            ],
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    )
};

