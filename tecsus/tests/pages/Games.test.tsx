import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizPage from "../../src/pages/Games";
import MemoryGame from "@components/educational/MemoryGame";
import DragDropGame from "@components/educational/DragDropGame";
import '@testing-library/jest-dom';

// Mock dos componentes e layout
jest.mock("../../src/layout/layoutNotLogged", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
jest.mock("../../src/components/educational/QuizGame", () => ({
  __esModule: true,
  default: () => <div>QuizGame Component</div>
}));
jest.mock("../../src/components/educational/DragDropGame", () => ({
  __esModule: true,
  default: () => <div>DragDropGame Component</div>
}));
jest.mock("../../src/components/educational/MemoryGame", () => ({
  __esModule: true,
  default: () => <div>MemoryGame Component</div>
}));

describe("QuizPage", () => {
  it("renderiza o QuizGame por padrão", () => {
    render(<QuizPage />);
    expect(screen.getByText(/quiz de diagnóstico/i)).toBeInTheDocument();
    expect(screen.getByText(/quizgame component/i)).toBeInTheDocument();
  });

  it("troca para DragDropGame ao clicar no botão", () => {
    render(<QuizPage />);
    fireEvent.click(screen.getByText(/arraste e solte/i));
    expect(screen.getByText(/dragdropgame component/i)).toBeInTheDocument();
  });

  it("troca para MemoryGame ao clicar no botão", () => {
    render(<QuizPage />);
    fireEvent.click(screen.getByText(/jogo da memória/i));
    expect(screen.getByText(/memorygame component/i)).toBeInTheDocument();
  });
});