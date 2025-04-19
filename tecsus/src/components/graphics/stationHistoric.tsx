import { LineChart } from '@mui/x-charts/LineChart';

interface DataPoint {
  name: string;
  value: string;
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
        acc[item.name].data.push(parseFloat(item.value));
        return acc;
      }, {} as Record<string, { label: string; data: number[]; showMark: boolean }>);
    
      const xAxisData = [...new Set(data.map(item => item.measure_date * 1000))].sort((a, b) => a - b);
    
      const series = Object.values(groupedData);
    
      return (
        <LineChart
          series={series}
          width={800}
          height={400}
          xAxis={[{
            data: xAxisData,
            scaleType: 'time',
            valueFormatter: (value) => new Date(value).toLocaleString(),
          }]}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: 8,
            },
          }}
          sx={{
            '.MuiLineElement-root': {
              strokeWidth: 2,
            },
          }}
        />
      );
    };