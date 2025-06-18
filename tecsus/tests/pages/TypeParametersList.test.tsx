import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TypeParametersList from "../../src/pages/TypeParametersList";
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
jest.mock("../../src/store/typeparameters/getters", () => ({
  __esModule: true,
  default: {
    listParameterTypes: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  },
}));

// Mock do contexto de autenticação
jest.mock("../../src/components/authContext", () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

describe("TypeParametersList", () => {
  it('exibe "Nenhum registro encontrado." quando não há dados', async () => {
    render(
      <MemoryRouter>
        <TypeParametersList />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Nenhum registro encontrado/i)).toBeInTheDocument()
    );
    });
  });