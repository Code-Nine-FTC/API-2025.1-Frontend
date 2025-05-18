import React, { useState } from "react";

const items = [
  { id: "termometro", label: "🌡️ Termômetro", match: "Temperatura" },
  { id: "barometro", label: "🧭 Barômetro", match: "Pressão atmosférica" },
  { id: "pluviometro", label: "🌧️ Pluviómetro", match: "Chuva" },
  { id: "anemometro", label: "💨 Anemômetro", match: "Velocidade do vento" },
];

const targets = [
  "Temperatura",
  "Pressão atmosférica",
  "Chuva",
  "Velocidade do vento",
];

const initialMatches = {
  Temperatura: null,
  "Pressão atmosférica": null,
  Chuva: null,
  "Velocidade do vento": null,
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DragDropGame: React.FC = () => {
  const [dragged, setDragged] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string | null }>(initialMatches);
  const [showResult, setShowResult] = useState(false);

  
  const [shuffledItems] = useState(() => shuffle(items));
  const [shuffledTargets] = useState(() => shuffle(targets));

  const handleDragStart = (id: string) => setDragged(id);

  const handleDrop = (target: string) => {
    if (dragged) {
      setMatches((prev) => ({
        ...prev,
        [target]: dragged,
      }));
      setDragged(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleCheck = () => setShowResult(true);

  const handleRestart = () => {
    setMatches(initialMatches);
    setShowResult(false);
  };

  return (
    <div style={{
      maxWidth: 900,
      margin: "40px auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 16px #0002",
      padding: 32,
      position: "relative"
    }}>
      <h2 style={{ textAlign: "center", color: "var(--purple-maincolor)", marginBottom: 8 }}>
        Associe o Instrumento ao Fenômeno
      </h2>
      <div style={{ marginBottom: 24, color: "var(--purple-maincolor)", textAlign: "center" }}>
        Arraste o instrumento para o fenômeno correspondente .
      </div>
      <div
        className="dragdrop-flex"
        style={{
          display: "flex",
          gap: 32,
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          width: "100%",
          boxSizing: "border-box",
          maxWidth: "100%",
        }}
      >
        {/* Coluna dos instrumentos */}
        <div style={{
          width: "50%",
          minWidth: 0,
          maxWidth: 400,
          boxSizing: "border-box",
          flex: 1,
        }}>
          <div style={{ fontWeight: "bold", color: "var(--purple-maincolor)", marginBottom: 12, textAlign: "center" }}>Instrumentos</div>
          {shuffledItems.map((item) => (
            <div
              key={item.id}
              draggable={!Object.values(matches).includes(item.id)}
              onDragStart={() => handleDragStart(item.id)}
              style={{
                opacity: Object.values(matches).includes(item.id) ? 0.4 : 1,
                background: "#fff",
                border: "2px solid var(--purple-maincolor)",
                borderRadius: 10,
                padding: "14px 22px",
                minWidth: 180,
                minHeight: 48,
                marginBottom: 16,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: Object.values(matches).includes(item.id) ? "not-allowed" : "grab",
                fontWeight: "bold",
                color: "var(--purple-maincolor)",
                userSelect: "none",
                fontSize: 18,
                boxShadow: "0 2px 8px var(--purple-maincolor)33",
                transition: "box-shadow 0.2s, opacity 0.2s",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        {/* Coluna dos alvos */}
        <div style={{
          width: "50%",
          minWidth: 0,
          maxWidth: 400,
          boxSizing: "border-box",
          flex: 1,
        }}>
          <div style={{ fontWeight: "bold", color: "var(--purple-maincolor)", marginBottom: 12, textAlign: "center" }}>Fenômenos</div>
          {shuffledTargets.map((target) => {
            const itemId = matches[target];
            const item = items.find(i => i.id === itemId);
            const correctItem = items.find(i => i.match === target);
            const isCorrect = itemId === correctItem?.id;
            const isFilled = !!itemId;
            return (
              <div
                key={target}
                onDrop={() => handleDrop(target)}
                onDragOver={handleDragOver}
                style={{
                  minHeight: 56,
                  minWidth: 260,
                  background: showResult
                    ? isCorrect
                      ? "#e8f5e9"
                      : isFilled
                        ? "#ffebee"
                        : "var(--purple-maincolorhover, #e3e0fd)"
                    : "var(--purple-maincolorhover, #e3e0fd)",
                  border: showResult
                    ? isCorrect
                      ? "2.5px solid #43a047"
                      : isFilled
                        ? "2.5px solid #e53935"
                        : "2.5px dashed var(--purple-maincolor)"
                    : "2.5px dashed var(--purple-maincolor)",
                  borderRadius: 10,
                  padding: "14px 22px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  color: "var(--purple-maincolor)",
                  fontSize: 17,
                  boxShadow: "0 2px 8px var(--purple-maincolor)11",
                  transition: "background 0.2s, border 0.2s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {target}:&nbsp;
                <span style={{
                  color: "var(--purple-maincolor)",
                  fontWeight: 500,
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  display: "inline-block",
                }}>
                  {item ? item.label : <span style={{ color: "#aaa" }}>Arraste aqui</span>}
                </span>
                {showResult && (
                  <span style={{
                    marginLeft: 10,
                    fontSize: 22,
                    fontWeight: "bold",
                  }}>
                    {isFilled ? (isCorrect ? "✅" : "❌") : ""}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        {!showResult ? (
          <button
            onClick={handleCheck}
            style={{
              padding: "12px 32px",
              borderRadius: 8,
              background: "var(--purple-maincolor)",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 1,
              boxShadow: "0 2px 8px var(--purple-maincolor)33",
              cursor: "pointer",
              marginRight: 10,
            }}
          >
            Conferir Respostas
          </button>
        ) : (
          <button
            onClick={handleRestart}
            style={{
              padding: "12px 32px",
              borderRadius: 8,
              background: "var(--purple-maincolor)",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 1,
              boxShadow: "0 2px 8px var(--purple-maincolor)33",
              cursor: "pointer",
              marginRight: 10,
            }}
          >
            Jogar Novamente
          </button>
        )}
      </div>
      {showResult && (
        <div
          style={{
            marginTop: 28,
            textAlign: "center",
            fontSize: 20,
            color: "var(--purple-maincolor)",
            fontWeight: "bold",
            animation:
              Object.entries(matches).filter(
                ([target, id]) =>
                  id && id === items.find(i => i.match === target)?.id
              ).length === targets.length
                ? "celebrate 1.2s ease"
                : undefined,
          }}
        >
          {
            Object.entries(matches).filter(
              ([target, id]) =>
                id && id === items.find(i => i.match === target)?.id
            ).length === 0
              ? "Você errou todas!"
              : Object.entries(matches).filter(
                  ([target, id]) =>
                    id && id === items.find(i => i.match === target)?.id
                ).length === targets.length
              ? "Parabéns! Você acertou tudo! 🎉"
              : `Você acertou ${
                  Object.entries(matches).filter(
                    ([target, id]) =>
                      id && id === items.find(i => i.match === target)?.id
                  ).length
                } de ${targets.length}!`
          }
        </div>
      )}
      <style>
        {`
        @media (max-width: 700px) {
          .dragdrop-flex {
            flex-direction: column !important;
            gap: 18px !important;
            align-items: stretch !important;
            flex-wrap: wrap !important;
          }
          .dragdrop-flex > div {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
        }
        @keyframes celebrate {
          0% { transform: scale(1); color: var(--purple-maincolor);}
          20% { transform: scale(1.15) rotate(-2deg); color: #43a047;}
          40% { transform: scale(1.1) rotate(2deg); color: #43a047;}
          60% { transform: scale(1.18) rotate(-2deg); color: #43a047;}
          80% { transform: scale(1.1) rotate(2deg); color: #43a047;}
          100% { transform: scale(1); color: var(--purple-maincolor);}
        }
        `}
      </style>
    </div>
  );
};

export default DragDropGame;