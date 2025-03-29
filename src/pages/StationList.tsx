import { LoggedLayout } from "@components/layout/layoutLogged";
import SearchBar from "@components/searchbar";
import StationTable from "@components/StationsTable";
import { Box } from "@mui/material";

export default function StationListPage() {
    return (
        <LoggedLayout>
            <Box className="alerts-container">
                <h1 className="alerts-title">Estações</h1>
                <StationTable />
            </Box>
        </LoggedLayout>
    );
}