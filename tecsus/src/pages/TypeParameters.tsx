import { Box } from "@mui/material";
import { LoggedLayout } from "../layout/layoutLogged";
import GenericTable from "../components/table";
import typeParameterGetters from "../store/typeparameters/getters"
import { ListParameterTypesResponse, ListParameterTypesFilters } from "../store/typeparameters/state";
import { useState, useEffect } from "react";

function TypeParametersPage() {
    const [typeParameters, setTypeParamters] = useState<ListParameterTypesResponse[]>([])
    const [error, setError] = useState<string| null>(null)
    const [filters, setFilters] = useState<ListParameterTypesFilters>()
    const columns = [
        { field: "name", headerName: "Name" },
        { field: "measure_unit", headerName: "Measure Unit" },
        { field: "qnt_decimals", headerName: "Quantity Decimals" },
        { field: "offset", headerName: "Offset" },
        { field: "factor", headerName: "Factor" },
        { field: "is_active", headerName: "Is Active" },
    ];

    useEffect(() => {
        getListTypeParameter();
    }, []);
    
    async function getListTypeParameter(){
        try{
            const response = await typeParameterGetters.listParameterTypes()
            if (response.success){
                setTypeParamters(response.data as ListParameterTypesResponse[])
            }}
            catch (err) {
                setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
            }
    }
    return (
        <LoggedLayout>
            <Box margin={2}>
                <GenericTable columns={columns} rows={[]} />
            </Box>
        </LoggedLayout>
    );
}
export default TypeParametersPage;