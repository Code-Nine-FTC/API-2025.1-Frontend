 import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export interface Column<T> {
  field: keyof T;
  headerName: string;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  renderCell?: (row: T, column: Column<T>) => React.ReactNode;
  renderActions?: (row: T) => React.ReactNode;
}

function GenericTable<T>({ columns, rows, renderCell, renderActions }: GenericTableProps<T>) {
  return (
    <TableContainer component={Paper}
      sx={{
        overflowX: 'auto',
        maxWidth: { xs: '89VW' }
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: 'rgb(146, 123, 230)', color: 'white' }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={String(column.field)} sx={{ color: 'white' }}>
                <b>{column.headerName}</b>
              </TableCell>
            ))}
            {renderActions && (
              <TableCell align="center" sx={{ color: 'white' }}>
                <b>Ações</b>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={String(column.field)}>
                  {renderCell ? renderCell(row, column) : String(row[column.field])}
                </TableCell>
              ))}
              {renderActions && (
                <TableCell align="center">
                  {renderActions(row)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GenericTable;
