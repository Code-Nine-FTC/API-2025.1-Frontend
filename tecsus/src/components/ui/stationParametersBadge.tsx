import { Box } from "@mui/material";

export default function StationParametersBadge({parameter} : {parameter: string}) {
    return (
        <Box
            sx={{
                backgroundColor: "white",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "14px",
                color: "rgb(146, 123, 230)",
                display: "inline-block",
            }}
        >
            {parameter}
        </Box>
    )
}