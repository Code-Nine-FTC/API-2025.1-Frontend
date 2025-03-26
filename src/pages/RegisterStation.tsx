import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import axios from "axios";

const CadastrarEstacoes = () => {
  const handleCreate = async (form: any) => {
    try {
      await axios.post("https://sua-api.com/weather_stations", {
        name: form.name,
        uid: form.uid,
        address: {
          zip: form.zip,
          street: form.street,
          number: form.number,
          neighborhood: form.neighborhood,
          city: form.city,
          state: form.state,
        },
        latitude: form.latitude,
        longitude: form.longitude,
      });
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