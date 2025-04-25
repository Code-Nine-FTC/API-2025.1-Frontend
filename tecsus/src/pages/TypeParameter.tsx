import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoggedLayout } from "../layout/layoutLogged";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider, 
  Grid, 
  Paper, 
  TextField, 
  Typography,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent
} from "@mui/material";
import parameterTypeGetters from "../store/typeparameters/getters";
import { ParameterTypesResponse, UpdatedParameterType } from "../store/typeparameters/state";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from "../components/authContext";
import { BlockOutlined, Check } from "@mui/icons-material";
import DefaultLayout from "../layout/layoutNotLogged";
import { GridDeleteIcon } from "@mui/x-data-grid";

const TypeParameterPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [parameterType, setParameterType] = useState<ParameterTypesResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
  	const [editMode, setEditMode] = useState<boolean>(false);

	const [name, setName] = useState<string>('');
	const [detectType, setDetectType] = useState<string>('');
	const [measureUnit, setMeasureUnit] = useState<string>('');
	const [isActive, setIsActive] = useState<boolean>(true);
	const [qntDecimals, setQntDecimals] = useState<number>(0);
	const [offset, setOffset] = useState<number | null>(0);
	const [factor, setFactor] = useState<number | null>(0);

	const auth = useAuth();
	
	useEffect(() => {
		async function fetchParameterTypeDetails() {
			try {
				setLoading(true);

				const response = await parameterTypeGetters.getParameterType(Number(id));

				console.log("Response from backend:", response.data);

				if (response.success && response.data) {
					setParameterType(response.data);
					setName(response.data.name || "");
					setDetectType(response.data.detect_type || "");
					setMeasureUnit(response.data.measure_unit || "");
					setIsActive(response.data.is_active ?? true);
					setQntDecimals(response.data.qnt_decimals ?? 0);
					setOffset(response.data.offset ?? null);
					setFactor(response.data.factor ?? null);
				} else {
					setError("Não foi possível carregar os detalhes do tipo de parâmetro");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Erro");
			} finally {
				setLoading(false);
			}
		}

		if (id) {
			fetchParameterTypeDetails();
		}

	}, [id]);

	if (loading) {
		return (
		  <LoggedLayout>
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
				<CircularProgress />
			</Box>
		  </LoggedLayout>
		);
	}

	if (error || !parameterType) {
		return (
			<LoggedLayout>
			  <Box margin={2}>
				<Paper sx={{ p: 3 }}>
				  <Typography variant="h5" color="error" gutterBottom>
					{error || "Tipo de parâmetro não encontrado"}
				  </Typography>
				  <Button 
					variant="contained" 
					startIcon={<ArrowBackIcon />}
					onClick={() => navigate("/list-parameter-type")}
				  >
					Voltar
				  </Button>
				</Paper>
			  </Box>
			</LoggedLayout>
		);
	}

	const handleSave = async () => {
		try {
			setLoading(true);

			const updatedParameterType: UpdatedParameterType = {}

			if (name != parameterType?.name) updatedParameterType.name = name;
			if (detectType != parameterType?.detect_type) updatedParameterType.detect_type = detectType;
			if (measureUnit != parameterType?.measure_unit) updatedParameterType.measure_unit = measureUnit;
			if (isActive != parameterType?.is_active) updatedParameterType.is_active = isActive;
			if (qntDecimals != parameterType?.qnt_decimals) updatedParameterType.qnt_decimals = qntDecimals;
			if (offset && offset != parameterType?.offset) updatedParameterType.offset = offset;
			if (factor && factor != parameterType?.factor) updatedParameterType.factor = factor;

			const response = await parameterTypeGetters.updateParameterType(Number(id), updatedParameterType);

			if (response.success) {
				setEditMode(false);
				setLoading(false);
				setError(null);
			}
			else {
				setError("Erro ao atualizar o tipo de parâmetro");
			}
		}
		catch (err) {
			setError(err instanceof Error ? err.message : "Ocorreu um erro ao salvar as alterações");
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete() {
		try {
		  if (!id) return;
		  const response = await parameterTypeGetters.deleteParameterType(Number(id));
		  if (response.success) {
			navigate("/list-parameter-type");
		  } else {
			setError("Erro ao excluir tipo de parâmetro.");
		  }
		} catch (err) {
		  setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido");
		}
	  }
	  

	const content = (
		<Box className="estacao-wrapper">
			<Paper className="estacao-card">
				<Typography variant="h4" align="center" className="estacao-title">
					{editMode ? "Editar Tipo de Parâmetro" : "Detalhes do Tipo de Parâmetro"}
				</Typography>
				<form
					className="estacao-form"
					onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}
				>
					<div className="input-group-wrapper">
						<div className="input-group">
							<label className="input-label">
								<strong>Nome</strong>
							</label>
							<input
								type="text"
								name="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={!editMode}
								className="input-field"
							/>
						</div>
					</div>
					<div className="input-group-wrapper">
						<div className="input-group">
							<label className="input-label">
								<strong>Tipo de Detecção</strong>
							</label>
							<input
								type="text"
								name="detectType"
								value={detectType}
								onChange={(e) => setDetectType(e.target.value)}
								disabled={!editMode}
								className="input-field"
							/>
						</div>
					</div>
					<div className="input-group-wrapper">
						<div className="input-group">
							<label className="input-label">
								<strong>Unidade de Medida</strong>
							</label>
							<input
								type="text"
								name="measureUnit"
								value={measureUnit}
								onChange={(e) => setMeasureUnit(e.target.value)}
								disabled={!editMode}
								className="input-field"
							/>
						</div>
					</div>
					<div className="input-group-wrapper">
						<div className="input-group">
							<label className="input-label">
								<strong>Quantidade de Decimais</strong>
							</label>
							<input
								type="number"
								name="qntDecimals"
								value={qntDecimals}
								onChange={(e) => setQntDecimals(Number(e.target.value))}
								disabled={!editMode}
								className="input-field"
							/>
						</div>
					</div>
					<div className="input-group-wrapper">
						<div className="input-group">
							<label className="input-label">
								<strong>Offset</strong>
							</label>
							<input
								type="number"
								name="offset"
								value={offset ?? ""}
								onChange={(e) => setOffset(e.target.value ? Number(e.target.value) : null)}
								disabled={!editMode}
								className="input-field"
							/>
						</div>
					</div>
					<div className="input-group-wrapper">
						<div className="input-group">
							<label className="input-label">
								<strong>Fator</strong>
							</label>
							<input
								type="number"
								name="factor"
								value={factor ?? ""}
								onChange={(e) => setFactor(e.target.value ? Number(e.target.value) : null)}
								disabled={!editMode}
								className="input-field"
							/>
						</div>
					</div>
					<div className="input-group-wrapper">
						<div className="input-group">
							<label className="input-label">
								<strong>Ativo</strong>
							</label>
							<Select
								value={isActive ? "true" : "false"}
								onChange={(e) => setIsActive(e.target.value === "true")}
								disabled={!editMode}
								className="input-field"
							>
								<MenuItem value="true">Sim</MenuItem>
								<MenuItem value="false">Não</MenuItem>
							</Select>
						</div>
					</div>
					<Box mt={3} textAlign="center">
						{!editMode ? (
							<>
							<Button
								variant="contained"
								startIcon={<EditIcon />}
								onClick={() => setEditMode(true)}
								className="type-parameter-btn"
								sx={{ backgroundColor: "#5f5cd9", color: "white", marginRight: 2 }}
							>
								Editar
							</Button>
							<Button
								variant="outlined"
								startIcon={<ArrowBackIcon />}
								onClick={() => window.history.back()}
								className="type-parameter-btn"
								sx={{ marginRight: "10px" }}
							>
								Voltar
							</Button>
							<Button
							variant="contained"
							color="error"
							onClick={handleDelete}
							className="type-parameter-btn"
							>
							Deletar
							</Button>
						  </>
						) : (
							<>
								<Button
									variant="outlined"
									startIcon={<CancelIcon />}
									onClick={() => setEditMode(false)}
									className="type-parameter-btn"
									sx={{ marginRight: "10px", }}
								>
									Cancelar
								</Button>
								<Button
									variant="contained"
									startIcon={<SaveIcon />}
									type="submit"
									className="type-parameter-btn"
									style={{ backgroundColor: "#5f5cd9", color: "white" }}
								>
									Salvar
								</Button>
							</>
						)}
					</Box>
				</form>
			</Paper>
		</Box>
	)
	return auth.isAuthenticated ? (
		<LoggedLayout>
		{content}
		</LoggedLayout>
	):
	(
		<DefaultLayout>
		{content}
		</DefaultLayout>
	)
}

export default TypeParameterPage;