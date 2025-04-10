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
}

function GenericTable<T>({ columns, rows }: GenericTableProps<T>) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={String(column.field)}>{column.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={String(column.field)}>
                  {String(row[column.field])}
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
