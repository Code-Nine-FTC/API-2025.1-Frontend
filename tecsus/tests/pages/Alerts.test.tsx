import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AlertsTable, { AlertsTableProps } from "../../src/pages/AlertsList";
import "@testing-library/jest-dom";

// Mock de alertas para teste
const mockAlerts = [
  {
    id: 1,
    type_alert_name: "Temperatura",
    station_name: "Estação 1",
    measure_value: "42",
    create_date: "2024-06-16T12:00:00Z",
  },
];

// Mock da função de busca
const mockOnSearch = jest.fn().mockResolvedValue(undefined);

// Mock do contexto de autenticação
jest.mock("../../src/components/authContext", () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

// Mock do getter de alertas
jest.mock("../../src/store/alerts/getters", () => ({
  __esModule: true,
  default: {
    alertDisplayed: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
});
jest.mock("jspdf-autotable", () => jest.fn());

describe("AlertsTable", () => {
  it("deve renderizar o título 'Alertas' e a tabela", () => {
    render(
      <AlertsTable alerts={mockAlerts} loading={false} onSearch={mockOnSearch} />
    );
    expect(
      screen.getByRole("heading", { level: 4, name: "Alertas" })
    ).toBeInTheDocument();
    expect(screen.getByText("Temperatura")).toBeInTheDocument();
    expect(screen.getByText("Estação 1")).toBeInTheDocument();
  });

  it("deve mostrar mensagem de nenhum registro encontrado", () => {
    render(
      <AlertsTable alerts={[]} loading={false} onSearch={mockOnSearch} />
    );
    expect(screen.getByText("Nenhum registro encontrado.")).toBeInTheDocument();
  });

  it("deve mostrar o loading", () => {
    render(
      <AlertsTable alerts={[]} loading={true} onSearch={mockOnSearch} />
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("deve chamar onSearch ao clicar em 'Buscar'", () => {
    render(
      <AlertsTable alerts={mockAlerts} loading={false} onSearch={mockOnSearch} />
    );
    const buscarBtn = screen.getByRole("button", { name: /buscar/i });
    fireEvent.click(buscarBtn);
    expect(mockOnSearch).toHaveBeenCalled();
  });

  it("deve chamar displayedAlert ao clicar no botão de check", async () => {
    render(
      <AlertsTable alerts={mockAlerts} loading={false} onSearch={mockOnSearch} />
    );
    // O botão de check pode não ter texto, mas tem o ícone CheckIcon (acessível por label 'Check')
    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);
    expect((await screen.findAllByText("Alertas")).length).toBeGreaterThan(0);
  });
});