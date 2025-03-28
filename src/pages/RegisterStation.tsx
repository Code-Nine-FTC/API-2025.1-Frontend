import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { links } from "../services/api";

const CadastrarEstacoes = () => {
  const handleCreate = async (form: any) => {
    try {
      await links.createStation(form);
      alert("Estação cadastrada com sucesso!");
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