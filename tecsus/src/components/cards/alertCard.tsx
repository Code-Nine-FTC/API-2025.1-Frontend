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
      <Card sx={{bgcolor: getColor(type), color: 'white', borderRadius: '16px' }}>
        <CardContent>
          <Typography variant="h6" align="center">
            {type === 'R' ? 'Crítico' : type === 'Y' ? 'Atenção' : 'Seguro'}
          </Typography>
          <Typography variant="h4" align="center">{count}</Typography>
        </CardContent>
      </Card>
    );
  };