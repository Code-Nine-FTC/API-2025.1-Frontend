import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const EditarEstacoes = () => {
  const { id } = useParams();
  const [station, setStation] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`https://sua-api.com/weather_stations/${id}`);
      const data = res.data;
      setStation({
        ...data,
        ...data.address,
      });
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (form: any) => {
    try {
      await axios.put(`https://sua-api.com/weather_stations/${id}`, {
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
      alert("Estação atualizada com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar estação");
    }
  };

  return (
    <LoggedLayout>
      {station && (
        <StationForm
          initialValues={station}
          onSubmit={handleUpdate}
          title="Editar Estação"
          submitLabel="Salvar Alterações"
        />
      )}
    </LoggedLayout>
  );
};

export default EditarEstacoes;