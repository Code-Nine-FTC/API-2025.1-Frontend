import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Education from "../../src/pages/Education";
import '@testing-library/jest-dom';

// Mock dos dados e componentes externos
jest.mock("../../src/data/educationData", () => ({
  educationCards: [
    {
      title: "Título 1",
      heading: "Cabeçalho 1",
      text: "Texto 1",
      imgSrc: "img1.png",
      fullText: "Texto completo 1"
    },
    {
      title: "Título 2",
      heading: "Cabeçalho 2",
      text: "Texto 2",
      imgSrc: "img2.png",
      fullText: "Texto completo 2"
    }
  ]
}));

jest.mock("../../src/layout/layoutNotLogged", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock("../../src/components/ui/Searchbar", () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      <input
        data-testid="searchbar"
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
      <button data-testid="search-btn" onClick={props.onSearchClick}>Buscar</button>
    </div>
  )
}));

describe("Education page", () => {
  it("renderiza cards de educação", () => {
    render(<Education />);
    expect(screen.getByText(/título 1/i)).toBeInTheDocument();
    expect(screen.getByText(/título 2/i)).toBeInTheDocument();
  });

  it("filtra cards ao pesquisar", () => {
    render(<Education />);
    const input = screen.getByTestId("searchbar");
    fireEvent.change(input, {
      target: { value: "Título 2" }
    });
    fireEvent.click(screen.getByTestId("search-btn"));
    expect(screen.queryByText(/título 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/título 2/i)).toBeInTheDocument();
  });

  it("mostra mensagem de nenhum resultado", () => {
    render(<Education />);
    const input = screen.getByTestId("searchbar");
    fireEvent.change(input, { target: { value: "Nada" } });
    fireEvent.click(screen.getByTestId("search-btn"));
    expect(screen.getByText(/nenhum resultado/i)).toBeInTheDocument();
  });
});