import React, { useState } from "react";

function secureShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
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

const questionsRaw = [
  {
    sensorData: "Temperatura: 30°C, Umidade: 90%, Pressão: 1005 hPa",
    question: "O que está acontecendo?",
    hint: "Observe a combinação de alta umidade e pressão baixa.",
    options: [
      { text: "Céu limpo", correct: false, explanation: "Céu limpo geralmente tem umidade mais baixa." },
      { text: "Tempestade", correct: true, explanation: "Alta umidade e pressão baixa indicam tempestade." },
      { text: "Frente fria", correct: false, explanation: "Frente fria costuma ter temperaturas mais baixas." },
    ],
  },
  {
    sensorData: "Temperatura: 15°C, Umidade: 40%, Pressão: 1020 hPa",
    question: "Qual o clima mais provável?",
    hint: "Pressão alta costuma indicar tempo estável.",
    options: [
      { text: "Chuva fraca", correct: false, explanation: "Chuva geralmente ocorre com umidade mais alta." },
      { text: "Nevoeiro", correct: false, explanation: "Nevoeiro costuma ter alta umidade." },
      { text: "Céu limpo", correct: true, explanation: "Pressão alta e baixa umidade indicam céu limpo e tempo estável." },
    ],
  },
  {
    sensorData: "Temperatura: 8°C, Umidade: 95%, Pressão: 1008 hPa",
    question: "O que pode estar ocorrendo?",
    hint: "Temperatura baixa e umidade alta favorecem um fenômeno comum nas manhãs frias.",
    options: [
      { text: "Chuva leve", correct: false, explanation: "Chuva leve pode ocorrer, mas nevoeiro é mais provável nessas condições." },
      { text: "Nevoeiro", correct: true, explanation: "Temperatura baixa e umidade alta favorecem a formação de nevoeiro." },
      { text: "Onda de calor", correct: false, explanation: "Onda de calor ocorre com temperaturas elevadas." },
    ],
  },
  {
    sensorData: "Temperatura: 35°C, Umidade: 25%, Pressão: 1012 hPa",
    question: "Qual fenômeno é mais provável?",
    hint: "Temperatura muito alta e ar seco são sinais de um fenômeno perigoso.",
    options: [
      { text: "Granizo", correct: false, explanation: "Granizo ocorre com instabilidade e não apenas calor seco." },
      { text: "Chuva isolada", correct: false, explanation: "Chuva geralmente ocorre com umidade elevada." },
      { text: "Onda de calor", correct: true, explanation: "Temperatura muito alta e baixa umidade indicam onda de calor." },
    ],
  },
  {
    sensorData: "Temperatura: 22°C, Umidade: 85%, Pressão: 1002 hPa",
    question: "O que pode estar prestes a acontecer?",
    hint: "Alta umidade e pressão baixa geralmente antecedem um evento comum.",
    options: [
      { text: "Tempo seco", correct: false, explanation: "Tempo seco ocorre com baixa umidade." },
      { text: "Chuva", correct: true, explanation: "Alta umidade e pressão baixa indicam possibilidade de chuva." },
      { text: "Geada", correct: false, explanation: "Geada ocorre com temperaturas próximas de 0°C." },
    ],
  },
  {
    sensorData: "Temperatura: 18°C, Umidade: 80%, Pressão: 1015 hPa",
    question: "Qual fenômeno é mais provável?",
    hint: "Esse fenômeno aparece ao amanhecer quando a umidade está alta.",
    options: [
      { text: "Orvalho", correct: true, explanation: "Temperatura amena e alta umidade favorecem a formação de orvalho ao amanhecer." },
      { text: "Tempestade", correct: false, explanation: "Tempestade geralmente ocorre com pressão mais baixa." },
      { text: "Neve", correct: false, explanation: "Neve ocorre com temperaturas próximas ou abaixo de 0°C." },
    ],
  },
  {
    sensorData: "Temperatura: 12°C, Umidade: 60%, Pressão: 1000 hPa",
    question: "O que pode estar acontecendo?",
    hint: "Pressão baixa e temperatura caindo indicam mudança de massa de ar.",
    options: [
      { text: "Seca", correct: false, explanation: "Seca ocorre com baixa umidade e temperaturas mais altas." },
      { text: "Frente fria chegando", correct: true, explanation: "Pressão baixa e temperatura caindo indicam chegada de frente fria." },
      { text: "Onda de calor", correct: false, explanation: "Onda de calor ocorre com temperaturas elevadas." },
    ],
  },
];

const questions = questionsRaw.map((q) => ({
  ...q,
  options: secureShuffle(q.options),
}));

const Quiz: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionClick = (idx: number) => {
    if (showExplanation) return;
    setSelected(idx);
    setShowExplanation(true);
    if (questions[current].options[idx].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setSelected(null);
    setShowExplanation(false);
    setShowHint(false);
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setShowHint(false);
    setScore(0);
  };

  const q = questions[current];
  const progress = Math.round(((current + (showExplanation ? 1 : 0)) / questions.length) * 100);

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
        <h2 style={{ textAlign: "center", color: "var(--purple-maincolor)", marginBottom: 8 }}>Jogo de Diagnóstico</h2>
        <div
          style={{
            background: "var(--purple-maincolorhover, #e3e0fd)",
            border: "1px solid var(--purple-maincolor)",
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 22,
            color: "var(--purple-maincolor)",
            fontSize: 15,
          }}
        >
          <b>Dica geral:</b> <br />
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Pressão atmosférica abaixo de 1013 hPa pode indicar chuva ou instabilidade.</li>
            <li>Alta umidade (acima de 80%) favorece chuva, nevoeiro ou orvalho.</li>
            <li>Temperaturas muito altas e baixa umidade sugerem onda de calor.</li>
            <li>Temperaturas baixas e alta umidade favorecem nevoeiro.</li>
          </ul>
        </div>
        <div style={{ margin: "0 0 24px 0" }}>
          <div
            style={{
              height: 8,
              borderRadius: 4,
              background: "#e0e0e0",
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, var(--purple-maincolor) 60%, var(--purple-maincolorhover, #e3e0fd) 100%)",
                transition: "width 0.4s",
              }}
            />
          </div>
          <div style={{ fontSize: 14, color: "#555", textAlign: "right" }}>
            {current + 1} / {questions.length}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
            boxShadow: "0 1px 4px #0001",
          }}
        >
          <p style={{ margin: 0, fontWeight: 500, color: "#333" }}>
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f6f0.png" alt="Satélite" style={{ width: 24, height: 24, verticalAlign: "middle", marginRight: 6 }} />
            <b>Dados dos sensores:</b> {q.sensorData}
          </p>
          <p style={{ margin: "12px 0 0 0", fontSize: 17 }}>{q.question}</p>
          {!showHint && !showExplanation && (
            <button
              onClick={() => setShowHint(true)}
              style={{
                marginTop: 12,
                background: "#fffbe7",
                color: "#b59f3b",
                border: "1px solid #ffe082",
                borderRadius: 6,
                padding: "6px 16px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: 15,
              }}
            >
              Ver dica
            </button>
          )}
          {showHint && !showExplanation && (
            <div
              style={{
                marginTop: 12,
                background: "#fffde7",
                color: "#b59f3b",
                border: "1px solid #ffe082",
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: 15,
              }}
            >
              <b>Dica:</b> {q.hint}
            </div>
          )}
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {q.options.map((opt) => {
            const isSelected = selected !== null && q.options[selected].text === opt.text;
            const isExplaining = showExplanation;
            const isCorrect = opt.correct;
            const optionIdx = q.options.findIndex(o => o.text === opt.text);

            const borderStyle =
              isSelected && isExplaining
                ? isCorrect
                  ? "2px solid #43a047"
                  : "2px solid #e53935"
                : "1px solid #bbb";

            const backgroundStyle =
              isSelected && isExplaining
                ? isCorrect
                  ? "#e8f5e9"
                  : "#ffebee"
                : "#f4f6fa";

            let boxShadowStyle: string | undefined;
            if (isSelected && isExplaining && isCorrect) {
              boxShadowStyle = "0 0 0 2px #43a04755";
            } else if (isSelected && isExplaining) {
              boxShadowStyle = "0 0 0 2px #e5393555";
            }

            const animationStyle =
              isSelected && isExplaining && isCorrect ? "celebrate-quiz 1.1s" : undefined;

            const fontWeightStyle = isSelected ? "bold" : "normal";
            const cursorStyle = isExplaining ? "default" : "pointer";

            let explanationBlock = null;
            if (isExplaining && isSelected) {
              explanationBlock = (
                <div
                  style={{
                    marginTop: 7,
                    padding: "10px 14px",
                    background: isCorrect ? "#c8e6c9" : "#ffcdd2",
                    borderRadius: 5,
                    fontSize: 15,
                    color: isCorrect ? "#256029" : "#b71c1c",
                    border: `1px solid ${isCorrect ? "#43a047" : "#e53935"}`,
                  }}
                >
                  {opt.explanation}
                </div>
              );
            }

            return (
              <li key={opt.text} style={{ marginBottom: 14 }}>
                <button
                  disabled={isExplaining}
                  onClick={() => handleOptionClick(optionIdx)}
                  style={{
                    width: "100%",
                    padding: "12px 18px",
                    borderRadius: 8,
                    border: borderStyle,
                    background: backgroundStyle,
                    color: "#222",
                    cursor: cursorStyle,
                    fontWeight: fontWeightStyle,
                    fontSize: 16,
                    boxShadow: boxShadowStyle,
                    transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
                    animation: animationStyle,
                  }}
                >
                  {opt.text}
                  {isSelected && isExplaining && isCorrect && (
                    <span style={{ marginLeft: 10, fontSize: 22 }}>🎉</span>
                  )}
                </button>
                {explanationBlock}
              </li>
            );
          })}
        </ul>
        {showExplanation && current < questions.length - 1 && (
          <button
            onClick={handleNext}
            style={{
              marginTop: 24,
              padding: "10px 28px",
              borderRadius: 8,
              background: "var(--purple-maincolor)",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              fontSize: 16,
              letterSpacing: 1,
              boxShadow: "0 2px 8px var(--purple-maincolor)33",
              cursor: "pointer",
            }}
          >
            Próxima
          </button>
        )}
        {showExplanation && current === questions.length - 1 && (
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 10,
                animation: score === questions.length ? "celebrate-quiz 1.2s" : undefined,
                color: score === questions.length ? "#43a047" : undefined,
              }}
            >
              Fim do quiz!
              {score === questions.length && <span style={{ marginLeft: 8 }}>🎉</span>}
            </div>
            <div style={{ fontSize: 17, marginBottom: 18 }}>
              Você acertou <b>{score}</b> de <b>{questions.length}</b> perguntas.
            </div>
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
                cursor: "pointer",
              }}
            >
              Reiniciar
            </button>
          </div>
        )}
        <style>
          {`
          @keyframes celebrate-quiz {
            0% { transform: scale(1); background: #e8f5e9; }
            20% { transform: scale(1.08) rotate(-2deg); background: #b9f6ca; }
            40% { transform: scale(1.04) rotate(2deg); background: #e8f5e9; }
            60% { transform: scale(1.12) rotate(-2deg); background: #b9f6ca; }
            80% { transform: scale(1.04) rotate(2deg); background: #e8f5e9; }
            100% { transform: scale(1); background: #e8f5e9; }
          }
          `}
        </style>
      </div>
  );
};

export default Quiz;