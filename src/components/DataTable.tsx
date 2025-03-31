import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Button, Paper, CircularProgress, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import "../pages/styles/alertlist.css";

interface Column<T> {
  label: string;
  key: keyof T;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  onSearch?: (query: string) => void;
  onResetSearch?: () => void;
  onAdd?: () => void;
  title?: string;
  renderActions?: (row: T) => React.ReactNode;
}

const DataTable = <T,>({
  data,
  columns,
  loading = false,
  error = null,
  onSearch,
  onResetSearch,
  onAdd,
  title = "",
  renderActions,
}: DataTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderCellContent = (row: T, key: keyof T) => {
    const value = row[key];
    
    // Handle undefined or null
    if (value === undefined || value === null) {
      return "-";
    }
    
    // Handle objects like address
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      // Format address object
      if (key === 'address') {
        const addr = value as any;
        return `${addr.city || ''}, ${addr.state || ''}, ${addr.country || ''}`.replace(/^, |, $/g, '');
      }
      return JSON.stringify(value);
    }
    
    // Handle dates
    if (key === 'create_date' && typeof value === 'string') {
      return new Date(value).toLocaleString('pt-BR');
    }
    
    return String(value);
  }

  return (
    <div className="data-table-container">
      {title && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h1 className="data-table-title">{title}</h1>
        </Box>
      )}
      {loading && (
        <div className="data-table-loading">
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <Paper className="data-table-content">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>{column.label}</TableCell>
                  ))}
                  {renderActions && <TableCell align="center"></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {columns.map((column) => (
                          <TableCell key={column.key as string}>
                            {renderCellContent(row, column.key)}
                          </TableCell>
                        ))}
                        {renderActions && (
                          <TableCell align="center">{renderActions(row)}</TableCell>
                        )}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      Nenhum dado disponível
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length || 1}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
};

export default DataTable;