import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PublicListsPage from "../../src/pages/PublicListsPage";
import "@testing-library/jest-dom";

// Mock layouts
jest.mock("../../src/layout/layoutLogged", () => ({
  LoggedLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock("../../src/layout/layoutNotLogged", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock subpages
jest.mock("../../src/pages/AlertsList", () => ({
  __esModule: true,
  default: () => <div>AlertsListPage</div>,
}));
jest.mock("../../src/pages/StationsList", () => ({
  __esModule: true,
  default: () => <div>StationsListPage</div>,
}));

// Mock auth context
jest.mock("../../src/components/authContext", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

describe("PublicListsPage", () => {
  it('exibe "Visualizar Listas" e alterna entre Alertas e Estações', () => {
    render(<PublicListsPage />);
    expect(screen.getByText(/Visualizar Listas/i)).toBeInTheDocument();
    expect(screen.getByText(/AlertsListPage/i)).toBeInTheDocument();

    // Troca para estações
    fireEvent.click(screen.getByRole("button", { name: /Estações/i }));
    expect(screen.getByText(/StationsListPage/i)).toBeInTheDocument();
  });
});