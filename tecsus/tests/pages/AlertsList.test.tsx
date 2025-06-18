import React from "react";
import { render, screen } from "@testing-library/react";
import AlertsListPage from "../../src/pages/AlertsList";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock do GenericTable e FilterBox
jest.mock("../../src/components/table", () => ({
  __esModule: true,
  default: () => <div>GenericTable</div>,
}));
jest.mock("../../src/components/ui/FilterBox", () => ({
  __esModule: true,
  default: () => <div>FilterBox</div>,
}));

// Mock do contexto de autenticação
jest.mock("../../src/components/authContext", () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

describe("AlertsListPage", () => {
  it('exibe "Nenhum registro encontrado." quando não há alertas', () => {
    render(
      <AlertsListPage
        alerts={[]}
        loading={false}
        onSearch={jest.fn()}
      />
    );
    expect(screen.getByText(/Nenhum registro encontrado/i)).toBeInTheDocument();
  });
});