import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { links } from "../services/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const EditarEstacoes = () => {
  const { id } = useParams();
  const [station, setStation] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await links.editStation(id as string, {
          name: "",
          uid: "",
          latitude: 0,
          longitude: 0,
          address: [],
        });
        const data = res.data;
        setStation({
          ...data,
          zip: data.address[0] || "",
          street: data.address[1] || "",
          number: data.address[2] || "",
          neighborhood: data.address[3] || "",
          city: data.address[4] || "",
          state: data.address[5] || "",
        });
      } catch (error) {
        alert("Erro ao carregar estação");
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (form: any) => {
    try {
      const response = await links.editStation(id as string, {
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
        alert("Estação atualizada com sucesso!");
      } else {
        alert(response.error || "Erro ao atualizar estação");
      }
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