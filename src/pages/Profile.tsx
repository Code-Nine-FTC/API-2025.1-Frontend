import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useAuth } from "../services/authContext";
import { links } from "../services/api";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await links.getUser();
        if (response.success) {
          setUserData(response.data);
        } else {
          setError(response.error || "Erro ao carregar os dados do usuário.");
        }
      } catch (err) {
        setError("Erro ao conectar ao servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Perfil do Usuário
        </Typography>
        <Typography variant="body1">
          <strong>Nome:</strong> {userData?.name}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {userData?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Última Atualização:</strong> {new Date(userData?.last_update).toLocaleString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;