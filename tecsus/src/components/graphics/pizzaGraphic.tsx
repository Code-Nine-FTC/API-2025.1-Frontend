import { PieChart } from "@mui/x-charts/PieChart";

interface props {
    data: { label: string; value: number }[];
}

export default function PizzaGraphic(props: props) {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <PieChart
                series={[
                    {
                        data: props.data,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        valueFormatter: (value) => `${value}%`,
                    },
                ]}                    
                width={400}
                height={350}
                margin={{ top: 10, right: 120, left: 30, bottom: 10 }}
                
                slotProps={{
                    legend: {
                        direction: "column",
                        position: { vertical: "middle", horizontal: "right" },
                        padding: 10,
                        labelStyle: {
                            fontSize: 14,
                        },
                    }
                }}
            />
        </div>
    );

}