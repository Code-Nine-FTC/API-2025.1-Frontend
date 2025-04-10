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
}

function GenericTable<T>({ columns, rows, renderCell }: GenericTableProps<T>) {
  return (    
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={String(column.field)}><b>{column.headerName}</b></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={String(column.field)}>
                  {renderCell
                  ? renderCell(row, column)
                  : String(row[column.field])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GenericTable;
