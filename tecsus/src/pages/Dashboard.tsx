import { Box, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from "@mui/material";
import { LoggedLayout } from "../layout/layoutLogged";
import { PieChart, Title } from "@mui/icons-material";
import PizzaGraphic from "../components/graphics/pizzaGraphic";
import InfoIcon from "@mui/icons-material/Info";

const dadosTeste = [
    {
        label: "Medida 1",
        value: 10,
    },
    {
        label: "Medida 2",
        value: 20,
    },
    {
        label: "Medida 3",
        value: 30,
    },
    {
        label: "Medida 4",
        value: 40,
    }
]

const DashboardPage = () => {
    return (
        <LoggedLayout>
            <Box sx={{ padding: 2}}>
                <Card sx={{ height: "50%", width: "50%", boxShadow: 3 }}>
                    <CardHeader
                        title={<Typography variant="h6">Impacto de cada medida</Typography>}
                        action={
                            <Tooltip title={"Linguada na pussy 👅"} arrow placement="top">
                                <IconButton>
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
                        }
                    />
                    <CardContent>
                        <PizzaGraphic
                            data={dadosTeste}
                        />
                    </CardContent>
                </Card>
            </Box>

        </LoggedLayout>
    );
};
export default DashboardPage;