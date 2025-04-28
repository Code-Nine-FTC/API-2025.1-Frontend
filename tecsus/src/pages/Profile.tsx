import React, { useEffect, useState } from "react";
import { Typography, Box, Avatar } from "@mui/material";
import "../pages/styles/profile.css";
import userStore from "../store/profile/getters";
import { Profile } from "../store/profile/state";
import { LoggedLayout } from "../layout/layoutLogged";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<Profile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await userStore.getProfile();
        setUserData(profile);
      } catch (error) {
        console.error("Erro ao carregar perfil do usuário", error);
      }
    };
    loadUser();
  }, []);

  return (
    <LoggedLayout>
      <div className="perfil-container">
        <Typography variant="h4" className="perfil-title">
          Perfil do Usuário
        </Typography>

        <div className="perfil-avatar" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Avatar sx={{ width: 120, height: 120, bgcolor: '#BDBDBD' }} />
        </div>

        <div className="perfil-dados" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <Typography className="info-label"><strong>Nome</strong></Typography>
              <Box className="info-box" sx={{ minHeight: 48 }}>{userData?.name ?? ""}</Box>
            </div>
            <div>
              <Typography className="info-label"><strong>Email</strong></Typography>
              <Box className="info-box" sx={{ minHeight: 48 }}>{userData?.email ?? ""}</Box>
            </div>
          </div>
        </div>
      </div>
    </LoggedLayout>
  );
};

export default ProfilePage;
