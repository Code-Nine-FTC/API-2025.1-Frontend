import React from "react";
import AlertsTable from "../components/AlertsTable";
import { LoggedLayout } from "@components/layout/layoutLogged";

const AlertList: React.FC = () => {
  return (
    <LoggedLayout>
      <div className="alerts-container">
        <h1 className="alerts-title">Alertas</h1>
        <AlertsTable />
      </div>
    </LoggedLayout>
  );
};

export default AlertList;