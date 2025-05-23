// sonarignore

import React, { useState, useEffect } from "react";

const pairs = [
  { id: "termometro", label: "🌡️ Termômetro", match: "Temperatura" },
  { id: "barometro", label: "🧭 Barômetro", match: "Pressão atmosférica" },
  { id: "pluviometro", label: "🌧️ Pluviómetro", match: "Chuva" },
  { id: "anemometro", label: "💨 Anemômetro", match: "Velocidade do vento" },
];

function secureShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  if (window.crypto && window.crypto.getRandomValues) {
    for (let i = arr.length - 1; i > 0; i--) {
      const rand = new Uint32Array(1);
      window.crypto.getRandomValues(rand);
      const j = rand[0] % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  return arr;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState(() => {
    const raw = pairs.flatMap(pair => [
      { id: pair.id + "-i", value: pair.id, text: pair.label, type: "instrument" },
      { id: pair.id + "-f", value: pair.id, text: pair.match, type: "phenomenon" }
    ]);
    return secureShuffle(raw);
  });
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lastMatched, setLastMatched] = useState<string | null>(null);

  const handleFlip = (id: string, value: string) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(value) || animating) return;
    setFlipped(f => [...f, id]);
    if (flipped.length === 1) setMoves(m => m + 1);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      setAnimating(true);
      const [first, second] = flipped;
      const card1 = cards.find(c => c.id === first);
      const card2 = cards.find(c => c.id === second);
      if (card1 && card2 && card1.value === card2.value && card1.id !== card2.id) {
        setTimeout(() => {
          setMatched(m => [...m, card1.value]);
          setLastMatched(card1.value);
          setFlipped([]);
          setAnimating(false);
        }, 700);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLastMatched(null);
          setAnimating(false);
        }, 1100);
      }
    } else if (flipped.length === 0 && lastMatched) {
      setTimeout(() => setLastMatched(null), 600);
    }
  }, [flipped, cards, lastMatched]);

  const handleRestart = () => {
    setCards(secureShuffle(cards));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setAnimating(false);
  };

  const finished = matched.length === pairs.length;

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "40px auto",
        background: "#f8f9fa",
        borderRadius: 12,
        boxShadow: "0 2px 16px #0002",
        padding: 32,
        position: "relative",
      }}
    >
      <h2 style={{ textAlign: "center", color: "var(--purple-maincolor)", marginBottom: 8 }}>Jogo da Memória</h2>
      <div style={{ marginBottom: 18, color: "var(--purple-maincolor)", textAlign: "center" }}>
        Encontre os pares: instrumento e fenômeno correspondente.
      </div>
      <div
        className="memory-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 18,
          justifyItems: "center",
          alignItems: "center",
          marginBottom: 24,
          maxWidth: 440,
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      >
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.value);
          const isMatchedNow = lastMatched === card.value && matched.includes(card.value);
          return (
            <div
              key={card.id}
              style={{
                perspective: 700,
                width: "100%",
                maxWidth: 100,
                minWidth: 70,
                height: 70,
              }}
            >
              <button
                onClick={() => handleFlip(card.id, card.value)}
                disabled={isFlipped || flipped.length === 2 || animating}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                  border: "none",
                  background: "none",
                  padding: 0,
                  cursor: isFlipped || flipped.length === 2 || animating ? "default" : "pointer",
                  outline: "none",
                  perspective: 700,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                    boxShadow: "0 2px 8px var(--purple-maincolor)33",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.5s cubic-bezier(.4,2,.6,1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Frente da carta */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      background: "var(--purple-maincolorhover, #e3e0fd)",
                      color: "var(--purple-maincolor)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 24,
                      borderRadius: 10,
                      border: `2px solid var(--purple-maincolor)`,
                      userSelect: "none",
                    }}
                  >
                    ?
                  </div>
                  {/* Verso da carta */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      background: isMatchedNow ? "var(--green-maincolor)" : "var(--purple-maincolor)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 14,
                      borderRadius: 10,
                      border: `2px solid ${isMatchedNow ? "var(--green-maincolor)" : "var(--purple-maincolor)"}`,
                      transform: "rotateY(180deg)",
                      userSelect: "none",
                      padding: "0 6px",
                      textAlign: "center",
                      transition: "background 0.3s, border 0.3s",
                    }}
                  >
                    {card.text}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        Movimentos: <b>{moves}</b>
      </div>
      {finished && (
        <div style={{
          marginTop: 18,
          textAlign: "center",
          fontSize: 18,
          color: "var(--purple-maincolor)",
          fontWeight: "bold",
          animation: "celebrate-memory 1.2s ease"
        }}>
          Parabéns! Você encontrou todos os pares! 🎉
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button
          onClick={handleRestart}
          style={{
            padding: "10px 28px",
            borderRadius: 8,
            background: "var(--purple-maincolor)",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            fontSize: 16,
            letterSpacing: 1,
            boxShadow: "0 2px 8px var(--purple-maincolor)33",
            cursor: "pointer"
          }}
        >
          {finished ? "Jogar Novamente" : "Reiniciar"}
        </button>
      </div>
      <style>
        {`
        @media (max-width: 600px) {
          .memory-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: repeat(4, 1fr) !important;
            max-width: 220px !important;
            gap: 12px !important;
          }
        }
        @keyframes celebrate-memory {
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

export default MemoryGame;