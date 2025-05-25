import { Card, CardContent, Typography } from "@mui/material";

interface StationStatusProps {
  active: number;
  total: number;
}

export const StationStatusCard = ({ active, total }: StationStatusProps) => {
  return (
    <Card sx={{ minWidth: 200, bgcolor: '#2196f3', color: 'white', borderRadius: '16px' }}>
      <CardContent>
        <Typography variant="h6" align="center"> Estações ativas</Typography>
        <Typography variant="h4" align="center">
          {active} de {total}
        </Typography>
      </CardContent>
    </Card>
  );
};