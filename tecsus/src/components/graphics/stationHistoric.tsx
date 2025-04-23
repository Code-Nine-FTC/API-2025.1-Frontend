import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useRef, useState } from 'react';

interface DataPoint {
  name: string;
  value: number;
  measure_unit: string;
  measure_date: number;
}

interface StationHistoricProps {
  data: DataPoint[];
}

export const StationHistoric = ({ data }: StationHistoricProps) => {
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = {
            label: `${item.name} (${item.measure_unit})`,
            data: [],
            showMark: false,
          };
        }
        acc[item.name].data.push(Number(item.value.toFixed(2)));
        return acc;
      }, {} as Record<string, { label: string; data: number[]; showMark: boolean }>);
    
      const xAxisData = [...new Set(data.map(item => item.measure_date * 1000))].sort((a, b) => a - b);
        
      const series = Object.values(groupedData);
          
      const ref = useRef<HTMLDivElement>(null);
      const [width, setWidth] = useState(800);
      
      useEffect(() => {
        function handleResize() {
          if (ref.current) setWidth(ref.current.offsetWidth);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
      return (
        <div ref={ref} style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
          <LineChart
            series={series}
            width={width}
            height={Math.round(width * 0.5)}
            margin={{bottom: 70}}
            xAxis={[{
              data: xAxisData,
              scaleType: 'time',
              valueFormatter: (value) => new Date(value).toLocaleString(),
            }]}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
              },
            }}
            sx={{
              '.MuiLineElement-root': {
                strokeWidth: 2,
              },
              overflowX: 'scroll',
            }}
          />
        </div>
      );
    };