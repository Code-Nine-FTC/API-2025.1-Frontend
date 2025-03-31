import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import StatusIcon from "./StatusIcon";

const rows = [
  { id: 1, name: "Item 1", status: "R" },
  { id: 2, name: "Item 2", status: "G" },
  { id: 3, name: "Item 3", status: "Y" },
  { id: 4, name: "Item 4", status: "D" },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Nome", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    renderCell: (params) => <StatusIcon status={params.value} size={24} />, // Renderiza o StatusIcon
  },
];

const StatusTable: React.FC = () => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
      />
    </div>
  );
};

export default StatusTable;