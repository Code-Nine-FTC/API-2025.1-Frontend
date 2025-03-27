import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { links } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const ViewStation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await links.getStation(id as string);
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
        setIsEditing(false);
      } else {
        alert(response.error || "Erro ao atualizar estação");
      }
    } catch (err) {
      alert("Erro ao atualizar estação");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await links.deleteStation(id as string);
      if (response.success) {
        alert("Estação deletada com sucesso!");
        navigate("/stations");
      } else {
        alert(response.error || "Erro ao deletar estação");
      }
    } catch (err) {
      alert("Erro ao deletar estação");
    }
  };

  return (
    <LoggedLayout>
      {station && (
        <>
          <StationForm
            initialValues={station}
            onSubmit={handleUpdate}
            title={isEditing ? "Editar Estação" : "Visualizar Estação"}
            submitLabel="Salvar Alterações"
            readOnly={!isEditing}
          />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            {!isEditing && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                style={{ marginRight: "10px" }}
              >
                Editar
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowDeletePopup(true)}
            >
              Deletar
            </Button>
          </div>
        </>
      )}

      <Dialog open={showDeletePopup} onClose={() => setShowDeletePopup(false)}>
        <DialogTitle>Confirmar Deleção</DialogTitle>
        <DialogContent>
          Tem certeza de que deseja deletar esta estação? Esta ação não pode ser desfeita.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeletePopup(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </LoggedLayout>
  );
};

export default ViewStation;