import React, { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { Search } from "@mui/icons-material";

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterField {
  name: string;
  label: string;
  type: "select" | "checkbox" | "date" | "text";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  options?: FilterOption[];
  fullWidth?: boolean;
}

interface FilterBoxProps {
  title?: string;
  filters: FilterField[];
  onSearch: () => void;
  onReset: () => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({
  title = "Filtros de Busca",
  filters,
  onSearch,
  onReset,
}) => {
  const [openCalendarField, setOpenCalendarField] = useState<string | null>(null);

  const renderFilterField = (filter: FilterField) => {
    const flexBasis = filter.fullWidth 
      ? { xs: '100%', sm: '100%', md: '50%', lg: '50%' }
      : { xs: '100%', sm: '50%', md: '25%', lg: '25%' };
      
    switch (filter.type) {
      case "text":
      case "select":
        return (
          <Box 
            key={filter.name} 
            sx={{ 
              padding: 1, 
              flexBasis: flexBasis,
              minWidth: { xs: '100%', sm: flexBasis.sm, md: flexBasis.md, lg: flexBasis.lg }
            }}
          >
            <FormControl
              fullWidth
              size="small"
              sx={{
                minHeight: "56px",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "white",
                  height: "46px",
                  border: '1px solid #ddd',
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "rgb(146, 123, 230)",
                  },
                  "&:focus-within": {
                    borderColor: "rgb(146, 123, 230)",
                    backgroundColor: "white",
                  },
                },
                "& .MuiMenu-paper": {
                  maxHeight: "300px",
                },
                "& .MuiSelect-select": {
                  padding: "10px 14px",
                  lineHeight: "1.5",
                  color: "#333",
                },
                "& .MuiInputLabel-root": {
                  color: "#666", 
                  "&.Mui-focused": {
                    color: "rgb(146, 123, 230)",
                  }
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ddd",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(146, 123, 230) !important",
                }
              }}
            >
              <InputLabel>{filter.label}</InputLabel>
              <Select
                label={filter.label}
                value={filter.value}
                onChange={(e: SelectChangeEvent) => filter.onChange(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 300 },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {filter.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case "checkbox":
        return (
          <Box 
            key={filter.name} 
            sx={{ 
              padding: 1,
              flexBasis: { xs: '100%', sm: '50%', md: '25%', lg: '25%' },
              minWidth: { xs: '100%', sm: '50%', md: '25%', lg: '25%' }
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={filter.value}
                  onChange={(e) => filter.onChange(e.target.checked)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 24,
                    },
                    '&.Mui-checked': {
                      color: 'rgb(146, 123, 230)',
                    },
                  }}
                />
              }
              label={filter.label}
              sx={{
                ml: 0,
                px: 1,
                height: "46px",
                display: "flex",
                alignItems: "center",
              }}
            />
          </Box>
        );
      case "date":
        return (
          <Box 
            key={filter.name} 
            sx={{ 
              padding: 1,
              flexBasis: flexBasis,
              minWidth: { xs: '100%', sm: flexBasis.sm, md: flexBasis.md, lg: flexBasis.lg }
            }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ptBR}
            >
              <DatePicker
                label={filter.label}
                value={filter.value || null}
                onChange={(date) => filter.onChange(date)}
                open={openCalendarField === filter.name}
                onOpen={() => setOpenCalendarField(filter.name)}
                onClose={() => setOpenCalendarField(null)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      width: "100%",
                      height: "46px",
                      "& .MuiInputBase-root": {
                        height: "46px",
                        backgroundColor: "white",
                        border: '1px solid #ddd',
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        "&:focus-within": {
                          backgroundColor: "white",
                        },
                        "& .MuiOutlinedInput-input": {
                          cursor: "pointer",
                          color: "#333",
                        },
                        "& .MuiInputAdornment-root": {
                          cursor: "pointer",
                          color: "rgb(146, 123, 230)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#666",
                        "&.Mui-focused": {
                          color: "rgb(146, 123, 230)",
                        }
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ddd",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgb(146, 123, 230) !important",
                      }
                    },
                    onClick: () => setOpenCalendarField(filter.name),
                  },
                  day: {
                    sx: {
                      "&.Mui-selected": {
                        backgroundColor: "rgb(146, 123, 230)",
                        "&:hover": {
                          backgroundColor: "rgb(126, 103, 210)",
                        },
                      },
                    },
                  },
                  popper: {
                    sx: {
                      "& .MuiPickersDay-root:focus.Mui-selected": {
                        backgroundColor: "rgb(126, 103, 210)",
                      },
                    }
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {title && (
        <Typography
          variant="h6"
          mb={2}
          sx={{
            color: "gray",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          margin: -1,
          mb: 3
        }}
      >
        {filters.map(renderFilterField)}
      </Box>
      
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "flex-end" 
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Button
            variant="outlined"
            onClick={onReset}
            sx={{
              borderRadius: "8px",
              fontWeight: "bold",
              color: "rgb(146, 123, 230)",
              borderColor: "rgb(146, 123, 230)",
              height: "40px",
              minWidth: "100px",
              "&:hover": {
                backgroundColor: "rgba(146, 123, 230, 0.1)",
                borderColor: "rgb(146, 123, 230)",
              },
            }}
          >
            Limpar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Search />}
            onClick={onSearch}
            sx={{
              borderRadius: "8px",
              fontWeight: "bold",
              backgroundColor: "rgb(146, 123, 230)",
              color: "white",
              height: "40px",
              minWidth: "100px",
              "&:hover": {
                backgroundColor: "rgb(126, 103, 210)",
              },
            }}
          >
            Buscar
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default FilterBox;