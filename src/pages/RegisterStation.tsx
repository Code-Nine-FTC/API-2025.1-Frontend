import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { links } from "../services/api";

const CadastrarEstacoes = () => {
  const handleCreate = async (form: any) => {
    try {
      const response = await links.registerStation({
        name: form.name,
        uid: form.uid,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        address: [
          form.zip,
          form.street,
          form.number,
          form.neighborhood,
          form.city,
          form.state,
        ],
      });

      if (response.success) {
        alert("Estação cadastrada com sucesso!");
      } else {
        alert(response.error || "Erro ao cadastrar estação");
      }
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