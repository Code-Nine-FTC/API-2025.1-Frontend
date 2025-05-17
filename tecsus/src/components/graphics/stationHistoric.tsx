import { Box } from "@mui/material";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/boost';
import React, { useMemo } from "react";

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

   const { minTimestampMs, maxTimestampMs, series } = useMemo(() => {
    let minTs: number | undefined = undefined;
    let maxTs: number | undefined = undefined;
    let srs: { name: string; type: 'line'; data: [number, number][]; }[] = [];

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
      }

      const groupedData = props.measure.reduce((acc, { measure_date, value, type, measure_unit }) => {
        if (!acc[type]) {
          acc[type] = { name: `${type} (${measure_unit})`, type: 'line', data: [] };
        }
        acc[type].data.push([measure_date * 1000, value]);
        return acc;
      }, {} as Record<string, { name: string; type: 'line', data: [number, number][] }>);
      
      srs = Object.values(groupedData);
    }
    return { minTimestampMs: minTs, maxTimestampMs: maxTs, series: srs };
  }, [props.measure]);
  
  const options: Highcharts.Options = useMemo(() => {
    return {
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
            text: '1h'
        }, {
            type: 'day',
            count: 1,
            text: '1d'
        }, {
            type: 'week',
            count: 1,
            text: '1sem'
        }, {
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