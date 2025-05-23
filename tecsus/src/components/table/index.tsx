import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Menu,
  Tooltip
} from "@mui/material";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';

export interface Column<T> {
  field: keyof T;
  headerName: string;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  renderCell?: (row: T, column: Column<T>) => React.ReactNode;
  renderActions?: (row: T) => React.ReactNode;
  tableName?: string;
}

const formatDateToBrazilianTimezone = (isoDateString: string): string => {
  try {
    const date = new Date(isoDateString);
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  } catch {
    return isoDateString;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatComplexValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    if (value && 'address' in value) {
      return formatComplexValue(value.address);
    }
    
    if (value && ('city' in value || 'state' in value || 'country' in value)) {
      const addressParts = [];
      
      if (value.city) addressParts.push(value.city);
      if (value.state) addressParts.push(value.state);
      if (value.country) addressParts.push(value.country);
      
      if (addressParts.length > 0) {
        return addressParts.join(', ');
      }
    }
    
    if (Array.isArray(value)) {
      return value.map(item => formatComplexValue(item)).join(', ');
    }
    
    try {
      const entries = Object.entries(value)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, val]) => val !== null && val !== undefined)
        .map(([key, val]) => `${key}: ${formatComplexValue(val)}`);
      
      return entries.length > 0 ? entries.join(', ') : '';
    } catch {
      return JSON.stringify(value);
    }
  }
  
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
    return formatDateToBrazilianTimezone(value);
  }
  
  return String(value);
};

const normalizeFileName = (fileName: string): string => {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_.-]/g, '')
    .replace(/_+/g, '_');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportPDF = (columns: Column<any>[], rows: any[], fileName: string = "table") => {
  const normalizedFileName = normalizeFileName(fileName);
  const doc = new jsPDF();
  const tableColumn = columns.map((column) => column.headerName);
  const tableRows = rows.map((row) =>
    columns.map((column) => formatComplexValue(row[column.field]))
  );

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 10 },
  });

  doc.save(`${normalizedFileName}.pdf`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportCSV = (columns: Column<any>[], rows: any[], fileName: string = "table") => {
  const normalizedFileName = normalizeFileName(fileName);
  const header = columns.map(column => column.headerName).join(',');
  const data = rows.map(row => 
    columns.map(column => {
      const formattedValue = formatComplexValue(row[column.field]);
      return typeof formattedValue === 'string' && (formattedValue.includes(',') || formattedValue.includes('"') || formattedValue.includes('\n')) 
        ? `"${formattedValue.replace(/"/g, '""')}"`
        : formattedValue;
    }).join(',')
  ).join('\n');
  
  const csvContent = `${header}\n${data}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${normalizedFileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportJSON = (rows: any[], fileName: string = "table") => {
  const normalizedFileName = normalizeFileName(fileName);
  const jsonString = JSON.stringify(rows, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${normalizedFileName}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function GenericTable<T>({ columns, rows, renderCell, renderActions, tableName }: GenericTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportPDF = () => {
    exportPDF(columns, rows, tableName || 'table');
    handleClose();
  };
  
  const handleExportCSV = () => {
    exportCSV(columns, rows, tableName || 'table');
    handleClose();
  };
  
  const handleExportJSON = () => {
    exportJSON(rows, tableName || 'table');
    handleClose();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setRowsPerPage(value === 'all' ? rows.length : parseInt(value, 10));
    setPage(0);
  };

  const displayedRows = rowsPerPage === rows.length
    ? rows
    : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper}
        sx={{
          overflowX: 'auto',
          maxWidth: { xs: '89VW' },
          position: 'relative'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 16px 8px 16px',
          backgroundColor: 'rgb(146, 123, 230)', 
        }}>
          <Box sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}>
            {tableName || 'Dados da tabela'}
          </Box>
          <Tooltip title="Exportar dados">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ 
                color: 'white',
                backgroundColor: 'rgb(146, 123, 230)', 
                '&:hover': { 
                  backgroundColor: 'rgb(126, 103, 210)' 
                }
              }}
            >
              <FileDownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleExportPDF} sx={{ gap: 1 }}>
              <PictureAsPdfIcon fontSize="small" />
              Exportar PDF
            </MenuItem>
            <MenuItem onClick={handleExportCSV} sx={{ gap: 1 }}>
              <TableChartIcon fontSize="small" />
              Exportar CSV
            </MenuItem>
            <MenuItem onClick={handleExportJSON} sx={{ gap: 1 }}>
              <CodeIcon fontSize="small" />
              Exportar JSON
            </MenuItem>
          </Menu>
        </Box>

        <Table>
          <TableHead sx={{ backgroundColor: 'rgb(146, 123, 230)', color: 'white' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={String(column.field)} sx={{ color: 'white', textAlign: 'center' }}>
                  <b>{column.headerName}</b>
                </TableCell>
              ))}
              {renderActions && (
                <TableCell align="center" sx={{ color: 'white', textAlign: 'center' }}>
                  <b>Ações</b>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={String(column.field)} sx={{ textAlign: 'center' }}>
                    {renderCell ? renderCell(row, column) : String(row[column.field])}
                  </TableCell>
                ))}
                {renderActions && (
                  <TableCell align="center" sx={{ textAlign: 'center' }}>
                    {renderActions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          padding: '8px 16px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <span style={{ marginRight: '8px' }}>Itens por página:</span>
            <FormControl variant="standard" size="small">
              <Select
                value={rowsPerPage === rows.length ? 'all' : rowsPerPage.toString()}
                onChange={handleChangeRowsPerPage}
                sx={{ minWidth: '80px' }}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="15">15</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="all">Todos</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              '.MuiTablePagination-toolbar': {
                padding: 0
              },
              '.MuiTablePagination-selectIcon': {
                display: 'none'
              },
              '.MuiTablePagination-select': {
                display: 'none'
              },
              '.MuiTablePagination-selectLabel': {
                display: 'none'
              }
            }}
          />
        </Box>
      </TableContainer>
    </>
  );
}

export default GenericTable;
