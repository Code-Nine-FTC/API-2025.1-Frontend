import { Box } from "@mui/material";
import Highcharts, { GradientColorObject, PatternObject } from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/boost';
import React, { useMemo } from "react";

interface LineGraphicProps {
  measure: {
    value: number;
    measure_unit: string;
    measure_date: number;
    type: string;
    title: string;
  }[];
  title: string;
}

function getColorString(potentialColor: string | GradientColorObject | PatternObject | undefined, fallbackColor: string = '#333333'): string {
  if (typeof potentialColor === 'string') {
    return potentialColor;
  }
  if (potentialColor && typeof potentialColor === 'object' && 'stops' in potentialColor) {
    if (potentialColor.stops && potentialColor.stops.length > 0 && typeof potentialColor.stops[0][1] === 'string') {
      return potentialColor.stops[0][1];
    }
  }
  return fallbackColor;
}

const LineGraphic = React.memo(function LineGraphic (props: LineGraphicProps) {

   const { minTimestampMs, maxTimestampMs, series, yAxes } = useMemo(() => {
    let minTs: number | undefined = undefined;
    let maxTs: number | undefined = undefined;
    let srs: { name: string; type: string; data: [number, number][]; yAxis: number; tooltip: { valueDecimals: number }; color?: string }[] = [];
    const yAxesConfig: Highcharts.YAxisOptions[] = [];
    const unitToYAxisIndex: Record<string, number> = {};
    let currentYAxisIndex = 0;
    
    const knownMeasureSeriesTypes: Record<string, string> = {
      'temp': 'line',
      'umid': 'line',
      'press': 'line',
      'precip': 'column',
      'chuv': 'column',
      'velvent': 'line',
    };
    const defaultSeriesType = 'line';

    if (props.measure && props.measure.length > 0) {
      minTs = props.measure[0].measure_date * 1000;
      maxTs = props.measure[0].measure_date * 1000;

      for (const point of props.measure) {
        const currentTimestampMs = point.measure_date * 1000;
        if (currentTimestampMs < (minTs)) { 
          minTs = currentTimestampMs;
        }
        if (currentTimestampMs > (maxTs)) { 
          maxTs = currentTimestampMs;
        }

      if (unitToYAxisIndex[point.measure_unit] === undefined) {
          unitToYAxisIndex[point.measure_unit] = currentYAxisIndex;
          
          const potentialAxisColor = (Highcharts.getOptions().colors || [])[currentYAxisIndex % (Highcharts.getOptions().colors || []).length];
          const axisColorString = getColorString(potentialAxisColor, '#000000');

          yAxesConfig.push({
            title: {
              text: point.measure_unit, 
              style: {
                color: axisColorString,
              },
              rotation: 0,
              align: 'high',
              textAlign: currentYAxisIndex % 2 === 0 ? 'right' : 'left',
              x: currentYAxisIndex % 2 === 0 ? 35 : -35,
              reserveSpace: true,
            },
            labels: {
              formatter: function (): string { 
                if (typeof this.value === 'number') {
                  return this.value.toFixed(2);
                }
                return String(this.value);
              },
              enabled: true,
              style: {
                color: axisColorString,
              },
              rotation: 0,
              align: currentYAxisIndex % 2 === 0 ? 'right' : 'left',
              x: currentYAxisIndex % 2 === 0 ? -10 : 10,
              reserveSpace: true,
            },
            tickPixelInterval: 30,
            opposite: currentYAxisIndex % 2 !== 0,
            gridLineWidth: 1,
            gridLineColor: axisColorString,
            gridLineDashStyle: currentYAxisIndex === 0 ? 'Solid' : 'Dash', 
            tickColor: axisColorString,
            lineColor: axisColorString,
          });
          currentYAxisIndex++;
        }
      }

      const groupedData = props.measure.reduce((acc, { measure_date, value, type, title, measure_unit }) => {
        const axisIndex = unitToYAxisIndex[measure_unit]; 
        const seriesKey = type;

        if (!acc[seriesKey]) {
          const normalizedType = type.toLowerCase();
          let determinedSeriesType = defaultSeriesType

          for (const knownTypeKey in knownMeasureSeriesTypes) {
            if (normalizedType === knownTypeKey) {
              determinedSeriesType = knownMeasureSeriesTypes[knownTypeKey];
              break;
            }
          }

          const seriesColorForThisSeries = (Highcharts.getOptions().colors || [])[axisIndex % (Highcharts.getOptions().colors || []).length] || '#333333';
          const seriesColorString = getColorString(seriesColorForThisSeries);

          acc[seriesKey] = {
             name: `${title} (${measure_unit})`, 
             type: determinedSeriesType, 
             data: [], 
             yAxis: axisIndex, 
             tooltip: { valueDecimals: 2 },
             color: seriesColorString,
            };
        }
        acc[seriesKey].data.push([measure_date * 1000, value]);
        return acc;
      }, {} as Record<string, { name: string; type: string, data: [number, number][]; yAxis: number; tooltip: { valueDecimals: number }, color?: string }>);
      
      srs = Object.values(groupedData);
      srs.sort((a, b) => {
        if (a.yAxis !== b.yAxis) {
          return a.yAxis - b.yAxis;
        }
        return a.name.localeCompare(b.name);
      });
    }
    return { minTimestampMs: minTs, maxTimestampMs: maxTs, series: srs, yAxes: yAxesConfig };
  }, [props.measure]);
  
  const options: Highcharts.Options = useMemo(() => {
    const potentialDefaultColor = (Highcharts.getOptions().colors || [])[0];
    const defaultAxisColorString = getColorString(potentialDefaultColor, '#666666');
    return {
      chart: {
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
        buttons: [
          {
            type: 'hour',
            count: 1,
            text: '1h',
            title: 'Visualizar última hora'
        }, {
            type: 'day',
            count: 1,
            text: '1d',
            title: 'Visualizar último dia'
        }, {
            type: 'week',
            count: 1,
            text: '1sem',
            title: 'Visualizar última semana'
        }, {
            type: 'month',
            count: 1,
            text: '1m',
            title: 'Visualizar último mês'
        }, {
            type: 'month',
            count: 3,
            text: '3m',
            title: 'Visualizar últimos 3 meses'
        }, {
            type: 'month',
            count: 6,
            text: '6m',
            title: 'Visualizar últimos 6 meses'
        }, {
            type: 'ytd',
            text: 'YTD',
            title: 'Visualizar desde o início do ano'
        }, {
            type: 'year',
            count: 1,
            text: '1a',
            title: 'Visualizar o útlimo ano'
        }, {
            type: 'all',
            text: 'Todos',
            title: 'Visualizar tudo'
        }],
        selected: 5,
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
      yAxis: yAxes.length > 0 ? yAxes : [{
        title: {
          text: 'Valor',
          textAlign: 'right',
          rotation: 0,
          align: 'high',
          x: -35,
          style: {
            color: defaultAxisColorString,
          },
          reserveSpace: true,
        },
        labels: {
          formatter: function (): string {
            if (typeof this.value === 'number') {
              return this.value.toFixed(2);
            }
            return String(this.value);
          },
          style: {
            color: defaultAxisColorString,
          },
          rotation: 0,
          align: 'right',
          x: -10,
          reserveSpace: true,
        },
        tickPixelInterval: 40,
        gridLineColor: defaultAxisColorString,
        gridLineWidth: 1,
        showLastLabel: false,
        lineColor: defaultAxisColorString,
        tickColor: defaultAxisColorString,
      }],
      legend: {
        enabled: true,
      },
      tooltip: {
        shared: true,
        crosshairs: true,
        formatter: function () {
          if (!this.points || this.points.length === 0) {
            return false; 
          }

          let s = `<b>${Highcharts.dateFormat('%A, %d de %B de %Y, %H:%M', this.x as number, true)}</b>`;
          this.points.forEach(point => {
            s += `<br/><span style="color:${point.series.color};">\u25CF</span> ${point.series.name}: ${Highcharts.numberFormat(point.y as number, 2)} ${point.series.options.custom?.unit || ''}`;
          });
          return s;
        }
      } as Highcharts.TooltipOptions,
      plotOptions: {
        series: {
          findNearestPointBy: 'xy',
          pointPlacement: 'between',
          events: { 
            legendItemClick: function(this: Highcharts.Series): boolean {
              const series = this;
              const chart = series.chart;

              setTimeout(() => {
                chart.yAxis.forEach((axis: Highcharts.Axis) => {
                  const associatedSeries = chart.series.filter(s => s.yAxis === axis);
                  
                  let futureVisibilityForAxis = false;
                  if (associatedSeries.includes(series)) { 
                    if (series.visible) {
                      futureVisibilityForAxis = true; 
                    } else { 
                      futureVisibilityForAxis = associatedSeries.some(s => s !== series && s.visible);
                    }
                  } else {
                     futureVisibilityForAxis = associatedSeries.some(s => s.visible);
                  }

                  if (axis.visible !== futureVisibilityForAxis) {
                    axis.update({
                      visible: futureVisibilityForAxis
                    }, false); 
                  }
                });
                chart.redraw(); 
              }, 0);

              return true; 
            }
          }
        },
        line: {
          marker: {
            enabled: false,
          },
        },
        spline: {
          marker: {
            enabled: false,
          },
        },
        column: {
          pointPadding: 0.1,
          borderWidth: 0
        }
      },
      series: series as Highcharts.SeriesOptionsType[],
    };
  }, [props.title, series, minTimestampMs, maxTimestampMs, yAxes]);

  return (
    <Box style={{ width: '100%', height: '500px', margin: '0 auto' }}>
      <HighchartsReact highcharts={Highcharts} options={options} constructorType={'stockChart'} containerProps={{ style: { height: '100%'} }}/>
    </Box>
  );
});

export default LineGraphic;