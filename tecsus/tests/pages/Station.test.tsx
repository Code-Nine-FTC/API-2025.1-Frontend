import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StationPage from "../../src/pages/Station";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock do contexto de autenticação
jest.mock("../../src/components/authContext", () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

// Mock do layout
jest.mock("../../src/layout/layoutLogged", () => ({
  LoggedLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock("../../src/layout/layoutNotLogged", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock dos componentes gráficos e cards
jest.mock("../../src/components/ui/stationHeader", () => () => <div>StationHeader</div>);
jest.mock("../../src/components/cards/alertCard", () => ({
  __esModule: true,
  default: ({ type, count }: any) => <div>{type}:{count}</div>,
}));
jest.mock("../../src/components/graphics/gaugeGraphic", () => () => <div>GaugeGraphic</div>);
jest.mock("../../src/components/graphics/thermometerGraphic", () => () => <div>ThermometerGraphic</div>);
jest.mock("../../src/components/graphics/bucketGraphic", () => () => <div>BucketGraphic</div>);
jest.mock("../../src/components/graphics/velocimeterGraphic", () => () => <div>VelocimeterGraphic</div>);
jest.mock("../../src/components/graphics/pizzaGraphic", () => () => <div>PizzaGraphic</div>);
jest.mock("../../src/components/graphics/stationHistoric", () => () => <div>LineGraphic</div>);

// Mock dos getters
jest.mock("../../src/store/station/getters", () => ({
  __esModule: true,
  default: {
    getStation: jest.fn(() => Promise.resolve({ success: false, data: null })),
  },
}));
jest.mock("../../src/store/dashboard/getters", () => ({
  __esModule: true,
  default: {
    getAlertCounts: jest.fn(() => Promise.resolve({ data: { R: 0, Y: 0, G: 0 } })),
    getMeasuresStatus: jest.fn(() => Promise.resolve({ data: [] })),
    getLastMeasures: jest.fn(() => Promise.resolve({ data: [] })),
    getStationHistoric: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  },
}));

describe("StationPage", () => {
  it("mostra mensagem de erro se falhar ao buscar estação", async () => {
    render(
      <MemoryRouter initialEntries={["/station/1"]}>
        <Routes>
          <Route path="/station/:id" element={<StationPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(/não foi possível carregar os dados da estação/i)
      ).toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
  });
});