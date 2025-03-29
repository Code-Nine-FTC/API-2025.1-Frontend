import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { links } from "../services/api";

const CadastrarEstacoes = () => {
  const handleCreate = async (form: any) => {
    try {
      await links.createStation({
        name: form.name,
        uid: form.uid,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        address: {
          city: form.address.city,
          state: form.address.state,
          country: form.address.country,
        },
        parameter_types: form.parameter_types,
      });
      alert("Estação cadastrada com sucesso!");
    } catch (err) {
      console.error("Erro ao cadastrar estação:", err);
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