import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';

import { useState } from 'react';

interface GaugeGraphicProps {
    value: number;
    title?: string;
    min?: number;
    max?: number;
    unit?: string;
}

export default function GaugeGraphic(props: GaugeGraphicProps) {
    const [chartOptions, setChartOptions] = useState<Highcharts.Options> ({
        chart: {
            type: 'solidgauge',
            // plotBackgroundColor: null,
            plotBackgroundImage: undefined,
            plotBorderWidth: 0,
            plotShadow: false,
            height: '80%'
        },
        title: {
            text: props.title
        },
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                } as Highcharts.GradientColorObject,
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                } as Highcharts.GradientColorObject,
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
        yAxis: {
            min: props.min,
            max: props.max,
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 0
            },
            title: {
                text: props.unit,
            },
            plotBands: [{
                from: 0,
                to: 120,
                color: '#55BF3B' 
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D'
            }, {
                from: 160,
                to: 200,
                color: '#DF5353' 
            }]
        },
        series: [{
            type: 'gauge',
            name: props.title,
            data: [props.value],
            tooltip: {
                valueSuffix: props.unit
            },
            dataLabels: {
                format: '{y} ' + props.unit,
                borderWidth: 0,
                color: (
                    Highcharts.defaultOptions.title &&
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || '#333333',
                style: {
                    fontSize: '16px'
                }
            },
            dial: {
                radius: '80%',
                backgroundColor: 'gray',
                baseWidth: 12,
                baseLength: '0%',
                rearLength: '0%'
            },
            pivot: {
                backgroundColor: 'gray',
                radius: 6
            }
        }]
    });
    
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    );
};