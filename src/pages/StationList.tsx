import { LoggedLayout } from "@components/layout/layoutLogged";
import DefaultLayout from "@components/layout/layoutNotLogged";
import SearchBar from "@components/searchbar";
import StationTable from "@components/StationsTable";
import { Box } from "@mui/material";
import { useState } from "react";

export default function StationListPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const autenticado = (
        <LoggedLayout>
            <Box className="alerts-container">
                <h1 className="alerts-title">Estações</h1>
                <StationTable />
            </Box>
        </LoggedLayout>
    )

    const naoAutenticado = (
        <DefaultLayout>
            <Box className="alerts-container">
                <h1 className="alerts-title">Estações</h1>
                <StationTable />
            </Box>
        </DefaultLayout>
    )

    return (
        <>
            {isAuthenticated ? autenticado : naoAutenticado}
        </>
    );
}