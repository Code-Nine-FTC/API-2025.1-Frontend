import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TypeAlertsPage from "../../src/pages/TypeAlertsList";
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
jest.mock("../../src/store/typealerts/getters", () => ({
  __esModule: true,
  default: {
    listAlertTypes: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  },
}));

describe("TypeAlertsPage", () => {
  it('exibe "Nenhum registro encontrado." quando não há dados', async () => {
    render(
      <MemoryRouter>
        <TypeAlertsPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Nenhum registro encontrado/i)).toBeInTheDocument()
    );
  });
});