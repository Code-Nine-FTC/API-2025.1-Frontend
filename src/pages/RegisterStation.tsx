import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { links } from "../services/api";
import { useNavigate } from "react-router-dom";

const CadastrarEstacoes = () => {
  const navigate = useNavigate();
  const handleCreate = async (form: any) => {
    try {
      await links.createStation(form);
      alert("Estação cadastrada com sucesso!");
      navigate("/listarestacao");
    } catch (err) {
      alert("Erro ao cadastrar estação");
    }
  };

  return (
    <LoggedLayout>
      <StationForm onSubmit={handleCreate} title="Cadastrar Estação" submitLabel="Cadastrar" />
    </LoggedLayout>
  );
};

export default CadastrarEstacoes;