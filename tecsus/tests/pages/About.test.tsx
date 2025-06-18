import React from "react";
import { render, screen } from "@testing-library/react";
import About from "../../src/pages/About";
import "@testing-library/jest-dom";

// Mock do layout
jest.mock("../../src/layout/layoutNotLogged", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock das imagens
jest.mock("../../src/assets/about/aboutpageheader.png", () => "header.png");
jest.mock("../../src/assets/about/diogofoto.png", () => "diogo.png");
jest.mock("../../src/assets/about/tatianafoto.png", () => "tatiana.png");
jest.mock("../../src/assets/about/diegofoto.png", () => "diego.png");

describe("About page", () => {
  it('exibe os títulos principais e nomes do time', () => {
    render(<About />);
    expect(screen.getByText(/QUEM SOMOS/i)).toBeInTheDocument();
    expect(screen.getByText(/PROPÓSITO E VALORES/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /OBJETIVO/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/TIME EXECUTIVO/i)).toBeInTheDocument();
    expect(screen.getByText(/Diogo Branquinho/i)).toBeInTheDocument();
    expect(screen.getByText(/Tatiana Morelli/i)).toBeInTheDocument();
    expect(screen.getByText(/Diego Palharini/i)).toBeInTheDocument();
  });
});