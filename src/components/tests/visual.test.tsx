import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../navbar";
import Sidebar from "../sidebar";
import SearchBar from "../searchbar";
import ReusableModal from "../ReusableModal";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../assets/tecsus_logo.svg", () => "logo-mock.svg");
jest.mock("../../assets/logout_logo.svg", () => "logout-mock.svg");
jest.mock("../../services/authContext", () => ({
  useAuth: () => ({ logout: jest.fn() }),
}));

describe("Navbar", () => {
  it("renderiza logo e botões desktop", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByAltText(/logo-tecsus/i)).toBeInTheDocument();
    expect(screen.getByText(/sobre nós/i)).toBeInTheDocument();
    expect(screen.getByText(/educacional/i)).toBeInTheDocument();
    expect(screen.getByText(/listagem estação\/alerta/i)).toBeInTheDocument();
  });
});

describe("Sidebar", () => {
  it("renderiza itens do menu", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/estações/i)).toBeInTheDocument();
    expect(screen.getByText(/alertas/i)).toBeInTheDocument();
    expect(screen.getByText(/tipo de parâmetro/i)).toBeInTheDocument();
  });
});

describe("SearchBar", () => {
  it("executa busca ao clicar no botão", () => {
    const handleSearch = jest.fn();
    render(<SearchBar value="teste" onSearchClick={handleSearch} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleSearch).toHaveBeenCalled();
  });
});

describe("ReusableModal", () => {
  it("mostra título e conteúdo quando aberto", () => {
    render(
      <ReusableModal open={true} onClose={() => {}} title="Modal Test">
        <p>Conteúdo</p>
      </ReusableModal>
    );

    expect(screen.getByText(/modal test/i)).toBeInTheDocument();
    expect(screen.getByText(/conteúdo/i)).toBeInTheDocument();
  });
});
