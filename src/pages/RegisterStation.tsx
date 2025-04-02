import { StationForm } from "@components/StationForm";
import { LoggedLayout } from "@components/layout/layoutLogged";
import { links } from "../services/api";
import { useNavigate } from "react-router-dom";
import StationFormComponent from "@components/StationRegisterForm";

const CadastrarEstacoes = () => {

  return (
    <LoggedLayout>
      <StationFormComponent/>
    </LoggedLayout>
  );
};

export default CadastrarEstacoes;