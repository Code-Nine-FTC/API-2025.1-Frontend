import { Card, CardContent, Typography } from "@mui/material";

interface AlertCardProps {
    type: 'R' | 'Y' | 'G';
    count: number;
}

const getColor = (type: 'R' | 'Y' | 'G') => {
    const colors = {
      R: '#ff4444',
      Y: '#ffbb33',
      G: '#00C851'
    };
    return colors[type];
  };

  export function AlertCard ({ type, count }: AlertCardProps) {
    return (
      <Card sx={{ minWidth: 200, bgcolor: getColor(type), color: 'white' }}>
        <CardContent>
          <Typography variant="h6">
            {type === 'R' ? 'Crítico' : type === 'Y' ? 'Alerta' : 'Seguro'}
          </Typography>
          <Typography variant="h4">{count}</Typography>
        </CardContent>
      </Card>
    );
  };