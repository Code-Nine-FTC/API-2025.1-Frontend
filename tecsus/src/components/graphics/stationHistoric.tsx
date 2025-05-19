import { Box } from "@mui/material";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/boost';
import React, { useMemo } from "react";
// import HC_pt_BR from 'highcharts/modules/lang-pt-br';

interface LineGraphicProps {
  measure: {
    value: number;
    measure_unit: string;
    measure_date: number;
    type: string;
  }[];
  title: string;
}

const LineGraphic = React.memo(function LineGraphic (props: LineGraphicProps) {

   const { minTimestampMs, maxTimestampMs, series, yAxes } = useMemo(() => {
    let minTs: number | undefined = undefined;
    let maxTs: number | undefined = undefined;
    let srs: { name: string; type: 'line'; data: [number, number][]; yAxis: number; tooltip: { valueDecimals: number }}[] = [];
    const yAxesConfig: Highcharts.YAxisOptions[] = [];
    const unitToYAxisIndex: Record<string, number> = {};
    let currentYAxisIndex = 0;

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
          const axisColor = (Highcharts.getOptions().colors || [])[currentYAxisIndex % (Highcharts.getOptions().colors || []).length] || '#000000';

          yAxesConfig.push({
            title: {
              text: point.measure_unit, 
              style: {
                color: axisColor.toString(),
              },
            },
            labels: {
              formatter: function (): string {
                if (typeof this.value === 'number') {
                  return this.value.toFixed(2);
                }
                return String(this.value);
              },
              style: {
                color: axisColor.toString(),
              },
              rotation: -90,
              align: 'right',
            },
            opposite: currentYAxisIndex % 2 !== 0,
            gridLineWidth: currentYAxisIndex === 0 ? 1 : 0,
            gridLineColor: axisColor.toString(),
            gridLineDashStyle: 'Dash',
            tickColor: axisColor.toString(),
          });
          currentYAxisIndex++;
        }
      }

      const groupedData = props.measure.reduce((acc, { measure_date, value, type, measure_unit }) => {
        const axisIndex = unitToYAxisIndex[measure_unit]; // Get Y-axis index based on measure_unit
        const seriesKey = type;

        if (!acc[seriesKey]) {
          acc[seriesKey] = { name: `${type} (${measure_unit})`, type: 'line', data: [], yAxis: axisIndex, tooltip: { valueDecimals: 2 } };
        }
        acc[seriesKey].data.push([measure_date * 1000, value]);
        return acc;
      }, {} as Record<string, { name: string; type: 'line', data: [number, number][]; yAxis: number; tooltip: { valueDecimals: number } }>);
      
      srs = Object.values(groupedData);
      srs.sort((a, b) => a.yAxis - b.yAxis); // Sort series by Y-axis index
    }
    return { minTimestampMs: minTs, maxTimestampMs: maxTs, series: srs, yAxes: yAxesConfig };
  }, [props.measure]);
  
  const options: Highcharts.Options = useMemo(() => {
    const defaultAxisColor = (Highcharts.getOptions().colors || [])[0] || '#666666'; // Fallback color from default theme

    return {
      lang: {
        thousandsSep: '.',
        decimalPoint: ',',
        locale: 'pt-BR',
      },
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
      yAxis: yAxes.length > 0 ? yAxes : [{ // Use generated yAxes or a default single axis
        title: {
          text: 'Valor',
        },
        labels: {
          formatter: function (): string {
            if (typeof this.value === 'number') {
              return this.value.toFixed(2);
            }
            return String(this.value);
          },
          style: {
            color: defaultAxisColor.toString(),
          },
          rotation: -90,
          align: 'right',
        },
        gridLineWidth: 1,
        lineColor: defaultAxisColor,
        tickColor: defaultAxisColor,
      }],
      legend: {
        enabled: true,
      },
      tooltip: {
        shared: true,
        crosshairs: true,
        xDateFormat: '%A, %b %e, %Y, %H:%M',
        valueDecimals: 2,
      } as Highcharts.TooltipOptions,
      plotOptions: {
        series: {
          findNearestPointBy: 'xy',
        },
        line: {
          marker: {
            enabled: false,
          },
        },
      },
      series,
    };
  }, [props.title, series, minTimestampMs, maxTimestampMs]);

  return (
    <Box style={{ width: '100%', height: '500px', margin: '0 auto' }}>
      <HighchartsReact highcharts={Highcharts} options={options} constructorType={'stockChart'}/>
    </Box>
  );
});

export default LineGraphic;