import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper, Avatar, Divider, Button } from "@mui/material";
import { links } from "../services/api";
import { LoggedLayout } from "@components/layout/layoutLogged";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  last_update: string;
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await links.getUserProfile();
        if (response.success) {
          setUserData(response.data || null);
        } else {
          setError(response.error || "Erro ao carregar os dados do usuário.");
        }
      } catch (err) {
        console.error("Erro ao conectar ao servidor:", err);
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <LoggedLayout>
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            p: 4,
            maxWidth: "600px",
            width: "100%",
            borderRadius: 3,
            boxShadow: 4,
            textAlign: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              margin: "0 auto",
              bgcolor: "#5f5cd9",
              mb: 2,
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#5f5cd9" }}>
            {userData?.name || "Usuário"}
          </Typography>
          <Typography variant="body1" sx={{ color: "#757575", mb: 2 }}>
            {userData?.email || "Email não disponível"}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" sx={{ color: "#9e9e9e", mb: 2 }}>
            <strong>Última Atualização:</strong>{" "}
            {userData?.last_update ? new Date(userData.last_update).toLocaleString() : "Data não disponível"}
          </Typography>
        </Paper>
      </Box>
    </LoggedLayout>
  );
};

export default Profile;