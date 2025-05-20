import React, { useState } from "react";
import DefaultLayout from "../layout/layoutNotLogged";
import QuizGame from "../components/educational/QuizGame";
import DragDropGame from "../components/educational/DragDropGame";
import MemoryGame from "../components/educational/MemoryGame";

const QuizPage: React.FC = () => {
  const [tab, setTab] = useState<"quiz" | "drag" | "memory">("quiz");

  return (
    <DefaultLayout>
      <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0002", padding: 0 }}>
        <div style={{ display: "flex", borderBottom: "2px solid var(--purple-maincolor)" }}>
          <button
            onClick={() => setTab("quiz")}
            style={{
              flex: 1,
              padding: "18px 0",
              background: tab === "quiz" ? "var(--purple-maincolorhover, #e3e0fd)" : "#fff",
              border: "none",
              borderBottom: tab === "quiz" ? "3px solid var(--purple-maincolor)" : "3px solid transparent",
              color: "var(--black-logincolor)", 
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
              transition: "background 0.2s",
              borderTopLeftRadius: 12,
            }}
          >
            Quiz de Diagnóstico
          </button>
          <button
            onClick={() => setTab("drag")}
            style={{
              flex: 1,
              padding: "18px 0",
              background: tab === "drag" ? "var(--purple-maincolorhover, #e3e0fd)" : "#fff",
              border: "none",
              borderBottom: tab === "drag" ? "3px solid var(--purple-maincolor)" : "3px solid transparent",
              color: "var(--black-logincolor)",
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
              transition: "background 0.2s",
              borderTopRightRadius: 12,
            }}
          >
            Arraste e Solte
          </button>
          <button
            onClick={() => setTab("memory")}
            style={{
              flex: 1,
              padding: "18px 0",
              background: tab === "memory" ? "var(--purple-maincolorhover, #e3e0fd)" : "#fff",
              border: "none",
              borderBottom: tab === "memory" ? "3px solid var(--purple-maincolor)" : "3px solid transparent",
              color: "var(--black-logincolor)", // Sempre preto
              fontWeight: "bold",
              fontSize: 18,
              cursor: "pointer",
              transition: "background 0.2s",
              borderTopRightRadius: 12,
            }}
          >
            Jogo da Memória
          </button>
        </div>
        <div style={{ padding: 32 }}>
          {tab === "quiz" && <QuizGame />}
          {tab === "drag" && <DragDropGame />}
          {tab === "memory" && <MemoryGame />}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default QuizPage;