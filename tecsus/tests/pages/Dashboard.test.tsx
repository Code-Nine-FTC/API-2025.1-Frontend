import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../../src/pages/Dashboard";
import '@testing-library/jest-dom';

// Mock das dependências externas
jest.mock("../../src/layout/layoutLogged", () => ({
  LoggedLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
jest.mock("../../src/components/cards/alertCard", () => ({
  AlertCard: ({ type, count }: { type: string; count: number }) => (
    <div>
      Alerta {type}: <span>{count}</span>
    </div>
  )
}));
jest.mock("../../src/components/cards/stationStatusCard", () => ({
  StationStatusCard: ({ active, total }: { active: number; total: number }) => (
    <div>
      Estações: {active}/{total}
    </div>
  )
}));
jest.mock("../../src/components/graphics/pizzaGraphic", () => ({
  __esModule: true,
  default: ({ data }: { data: any }) => (
    <div>
      PizzaGraphic: {data && data.map((d: any) => d.name).join(", ")}
    </div>
  )
}));

// Mock do dashboardGetters
jest.mock("../../src/store/dashboard/getters", () => ({
  __esModule: true,
  default: {
    getAlertCounts: jest.fn(() =>
      Promise.resolve({ data: { R: 5, Y: 3, G: 7 } })
    ),
    getStationStatus: jest.fn(() =>
      Promise.resolve({ data: { total: 10, active: 8 } })
    ),
    getMeasuresStatus: jest.fn(() =>
      Promise.resolve({
        data: [
          { name: "Medida A", total: 4 },
          { name: "Medida B", total: 6 }
        ]
      })
    ),
  },
}));

describe("DashboardPage", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("renderiza dados mockados corretamente", async () => {
    render(<DashboardPage />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/alertas/i)).toBeInTheDocument();
      expect(screen.getByText(/Alerta R:/i)).toHaveTextContent("5");
      expect(screen.getByText(/Alerta Y:/i)).toHaveTextContent("3");
      expect(screen.getByText(/Alerta G:/i)).toHaveTextContent("7");
      expect(screen.getByText(/Estações:/i)).toHaveTextContent("8/10");
      expect(screen.getByText(/impacto de cada medida/i)).toBeInTheDocument();
      expect(screen.getByText(/PizzaGraphic/i)).toHaveTextContent("Medida A, Medida B");
    });
  });

  it("exibe mensagem de erro se a API falhar", async () => {
    const dashboardGetters = require("../../src/store/dashboard/getters").default;
    dashboardGetters.getAlertCounts.mockImplementationOnce(() =>
      Promise.reject(new Error("Falha na API"))
    );
    render(<DashboardPage />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/falha na api/i)).toBeInTheDocument();
    });
  });
});