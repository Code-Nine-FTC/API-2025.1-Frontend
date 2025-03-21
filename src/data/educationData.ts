import pluviometroImg from "/src/assets/pluviometro.jpg";
import pluviometro2Img from "/src/assets/pluviometro2.jpg";
import pluviometro3Img from "/src/assets/pluviometro3.png";

export const educationCards = [
  {
    title: "O que é uma Estação Meteorológica?",
    heading: "Definição e Utilização",
    text: "Uma estação meteorológica é uma instalação que mede temperatura, umidade, pressão e outros parâmetros...",
    fullText: `Uma estação meteorológica é uma instalação fixa (ou móvel) que reúne diversos instrumentos para medir parâmetros como temperatura, umidade, pressão atmosférica, velocidade e direção do vento, precipitação, radiação solar e outros.
    Esses dados são fundamentais tanto para a previsão do tempo quanto para estudos climáticos e aplicações em diversas áreas, como agricultura, aviação, defesa civil e gestão de recursos hídricos.`,
    imgSrc: pluviometroImg,
  },
  {
    title: "Tipos de Estação Meteorológica",
    heading: "Automáticas e Convencionais",
    text: "As estações meteorológicas podem ser automáticas ou convencionais...",
    fullText: `Existem dois tipos de estação meteorológica: as automáticas e as convencionais.

    - Estação automática: sua coleta de dados é totalmente automatizada e seus sensores emitem sinais elétricos, que são captados por um sistema de aquisição de dados (datalogger).
    - Estação convencional: exige a presença diária de uma pessoa para coletar os dados medidos. Esses instrumentos podem ser termômetros, pluviógrafos, termohigrógrafos e anemógrafos.

    Classes de estações meteorológicas:
    - Primeira classe: medem todos os elementos meteorológicos.
    - Segunda classe: não realizam medições de pressão atmosférica, radiação solar e vento.
    - Terceira classe: medem apenas temperatura máxima, temperatura mínima e chuva.`,
    imgSrc: pluviometro2Img,
  },
  {
    title: "Previsão do Tempo e Estudos Climáticos",
    heading: "Uso das Estações Meteorológicas",
    text: "Os dados meteorológicos são fundamentais para previsão do tempo, estudos climáticos e aplicações futuras...",
    fullText: `Os dados coletados por uma estação meteorológica são utilizados para diversos fins:

    - Previsão do tempo: uso dos dados para alimentar modelos numéricos que simulam a evolução da atmosfera e permitem prever condições futuras.
    - Estudos climáticos: análise de dados históricos para identificar tendências e variações climatológicas.
    - Aplicações futuras: suporte a atividades que dependem das condições meteorológicas, como planejamento agrícola, operações aeroportuárias e monitoramento de desastres naturais.`,
    imgSrc: pluviometro3Img,
  },
  {
    title: "Anemômetro - Medindo o Vento",
    heading: "Como Funciona um Anemômetro?",
    text: "O anemômetro mede a velocidade e a direção do vento...",
    fullText: `O anemômetro é um instrumento que mede a velocidade e a direção do vento. O exemplo mais comum é o anemômetro de copo, que calcula a velocidade registrando o número de rotações dos copos em um determinado intervalo de tempo.

    Fórmula para calcular a velocidade do vento:

    V = (N × C) / t

    Onde:
    - V = velocidade do vento (m/s)
    - N = número de rotações dos copos do anemômetro
    - C = constante de calibração do instrumento
    - t = tempo de medição (s)`,
    imgSrc: pluviometro2Img,
  },
  {
    title: "Pluviômetro - Medindo a Chuva",
    heading: "O que é um Pluviômetro?",
    text: "O pluviômetro mede a quantidade de precipitação de chuva...",
    fullText: `O pluviômetro é um instrumento utilizado para medir a quantidade de precipitação de chuva. Cada milímetro de precipitação corresponde a um litro de água por metro quadrado.

    Fórmula para calcular a precipitação total:

    P = N × C

    Onde:
    - P = precipitação total acumulada (mm)
    - N = número de pulsos registrados pelo pluviômetro
    - C = calibração do pluviômetro (mm/pulso)`,
    imgSrc: pluviometroImg,
  },
  {
    title: "Higrômetro - Medindo a Umidade do Ar",
    heading: "O que é um Higrômetro?",
    text: "O higrômetro mede a umidade relativa do ar, um fator essencial para estudos climáticos e previsão do tempo...",
    fullText: `O higrômetro é um instrumento empregado na medição da umidade relativa do ar. Esta medida representa a quantidade de vapor d'água presente no ar em relação à quantidade máxima que ele pode conter a uma determinada temperatura.

    Fórmula usada para calcular a umidade relativa do ar:

    UR = (e / es) * 100

    Onde:
    - UR = umidade relativa do ar (%)
    - e = pressão de vapor atual
    - es = pressão de vapor de saturação à mesma temperatura`,
    imgSrc: pluviometro3Img,
  },
  {
    title: "Barômetro - Medindo a Pressão Atmosférica",
    heading: "O que é um Barômetro?",
    text: "O barômetro mede a pressão atmosférica...",
    fullText: `O barômetro é um instrumento que mede a pressão atmosférica, essencial para prever mudanças climáticas.

    Equação barométrica para calcular a pressão atmosférica:

    P = P₀ × e^(-Mgh / RT)

    Onde:
    - P = pressão no ponto considerado
    - P₀ = pressão ao nível do mar
    - M = massa molar do ar
    - g = aceleração gravitacional
    - h = altura acima do nível do mar
    - R = constante universal dos gases
    - T = temperatura em Kelvin`,
    imgSrc: pluviometro2Img,
  },
];
