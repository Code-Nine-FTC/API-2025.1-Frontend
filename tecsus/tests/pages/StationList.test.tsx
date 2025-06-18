import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StationsListPage from "../../src/pages/StationsList";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock do layout
jest.mock("../../src/layout/layoutLogged", () => ({
  LoggedLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock dos componentes usados
jest.mock("../../src/components/table", () => ({
  __esModule: true,
  default: () => <div>GenericTable</div>,
}));
jest.mock("../../src/components/ui/FilterBox", () => ({
  __esModule: true,
  default: () => <div>FilterBox</div>,
}));

// Mock do getter para retornar lista vazia
jest.mock("../../src/store/station/getters", () => ({
  __esModule: true,
  default: {
    listStations: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  },
}));

// Mock do contexto de autenticação
jest.mock("../../src/components/authContext", () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

describe("StationsListPage", () => {
  it('exibe "Nenhum registro encontrado." quando não há dados', async () => {
    render(
      <MemoryRouter>
        <StationsListPage onlyView={false} />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Nenhum registro encontrado/i)).toBeInTheDocument()
    );
  });
});