import Header from "../assets/about/aboutpageheader.png";
import { Container, Box, Typography, Link, ListItem } from "@mui/material";
import DefaultLayout from "../layout/layoutNotLogged";
import List from "@mui/material/List";
import Diogo from "../assets/about/diogofoto.png"
import Tatiana from "../assets/about/tatianafoto.png"
import Diego from "../assets/about/diegofoto.png"

export default function About() {

  return (
    <DefaultLayout>
      <Box
        sx={{
          width: "100%",
          height: { xs: "200px", sm: "250px", md: "300px" },
          mb: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={Header}
          alt="About Page Header"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
      </Box>
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: "white",
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            component="h1"
            color="var(--purple-maincolor)"
            gutterBottom
          >
            QUEM SOMOS?
          </Typography>

          <Typography variant="body1" paragraph fontSize={20}>
            <Link
              href="https://github.com/Code-Nine-FTC"
              fontWeight="bold"
              color="#5652C7"
              aria-label="Link para nossa equipe"
              target="_blank"
            >
              Nossa equipe
            </Link>{" "}
            desenvolveu esse projeto em parceria com a TecSUS, uma empresa
            inovadora e comprometida com o desenvolvimento tecnológico
            sustentável. A Tecsus é uma empresa que se dedica ao desenvolvimento
            de dispositivos, aplicativos e sistemas para transmissão e recepção
            de dados, controle de equipamentos remotos e gestão de faturas. Seus
            produtos são aplicados nos setores de abastecimento de água,
            distribuição de eletricidade e gás natural.
          </Typography>
          <Typography variant="body1" paragraph fontSize={20}>
            A empresa nasceu a partir de projetos de engenharia voltados para o
            uso eficiente da água e a otimização do monitoramento ambiental,
            desenvolvidos pelo Instituto Tecnológico de Aeronáutica (ITA). A
            empresa desenvolve sua estrutura de negócios no Parque Tecnológico
            de São José dos Campos (SP), aprimorando as suas soluções de
            software e hardware integrados na Incubadora Nexus
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            component="h1"
            color="var(--purple-maincolor)"
            gutterBottom
          >
            PROPÓSITO E VALORES
          </Typography>
          <Typography variant="body1" paragraph fontSize={20}>
            A Tecsus tem como propósito o desenvolvimento tecnológico para a
            sustentabilidade do planeta. A empresa entende que o planeta é
            finito e que a forma como a sociedade se relaciona com ele define
            sua sustentabilidade. A contribuição da empresa não se limita à
            criação de mecanismos e tecnologias para o apoio à métrica da
            sustentabilidade, mas também abrange a propagação de informações que
            são capazes de gerar mudanças de hábitos e atitudes em prol da
            sustentabilidade.
          </Typography>
          <Typography variant="body1" fontSize={20} sx={{ mb: 2 }}>
            Seus valores são:
          </Typography>

          <List sx={{ pl: 2 }}>
            <ListItem
              sx={{
                px: 0,
                py: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 2,
                    color: "var(--purple-maincolor)",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  •
                </Box>
                <Typography
                  component="span"
                  variant="h6"
                  fontWeight="bold"
                  color="var(--purple-maincolor)"
                >
                  Inovação
                </Typography>
              </Box>
              <Typography variant="body1" fontSize={18} sx={{ ml: 4 }}>
                A transformação para um mundo sustentável demanda investimentos
                contundentes em inovação, aplicados de maneira abrangente em
                todos os processos da empresa, tanto no desenvolvimento de
                produtos quanto na organização empresarial.
              </Typography>
            </ListItem>

            <ListItem
              sx={{
                px: 0,
                py: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 2,
                    color: "var(--purple-maincolor)",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  •
                </Box>
                <Typography
                  component="span"
                  variant="h6"
                  fontWeight="bold"
                  color="var(--purple-maincolor)"
                >
                  Empatia
                </Typography>
              </Box>
              <Typography variant="body1" fontSize={18} sx={{ ml: 4 }}>
                A capacidade de enxergar com os olhos de outra pessoa é
                essencial para se desenvolver, entregar resultados e gerar um
                melhor relacionamento entre as pessoas.
              </Typography>
            </ListItem>

            <ListItem
              sx={{
                px: 0,
                py: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 2,
                    color: "var(--purple-maincolor)",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  •
                </Box>
                <Typography
                  component="span"
                  variant="h6"
                  fontWeight="bold"
                  color="var(--purple-maincolor)"
                >
                  Sustentabilidade
                </Typography>
              </Box>
              <Typography variant="body1" fontSize={18} sx={{ ml: 4 }}>
                Princípio norteador de todas as ações, que visam à preservação
                do meio ambiente, de modo a garantir os recursos naturais para
                as gerações futuras.
              </Typography>
            </ListItem>
          </List>
          <Typography
            variant="h4"
            fontWeight="bold"
            component="h1"
            color="var(--purple-maincolor)"
            gutterBottom
          >
            OBJETIVO
          </Typography>
          <Typography variant="body1" paragraph fontSize={20}>
            O objetivo do projeto consiste no desenvolvimento de um portal
            para a coleta de dados de uma estação meteorológica
            periodicamente. A iniciativa visa envolver estudantes do ensino
            médio com a aprendizagem baseada em problemas e demonstrar os
            conceitos matemáticos envolvidos nos cálculos dos parâmetros. Além
            disso, o projeto busca relacionar a importância do monitoramento
            ambiental como ferramenta para evitar desastres naturais por meio
            da geração de alertas.
          </Typography>
        </Box>

        <Typography
          variant="h4"
          fontWeight="bold"
          component="h1"
          color="var(--purple-maincolor)"
          gutterBottom
          sx={{ textAlign: "center", mb: 4 }}
        >
          TIME EXECUTIVO
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: { xs: 4, md: 8 }, 
            p: { xs: 3, md: 5 }, 
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: "white",
            maxWidth: "100%",
          }}
        >
          <Box sx={{ 
            textAlign: "center", 
            maxWidth: { xs: 200, sm: 250, md: 300 },
            p: 2 
          }}>
              <Box
                component="img"
                src={Diogo}
                alt="Diogo Branquinho"
                sx={{
                  width: { xs: 150, sm: 180, md: 220 },
                  height: { xs: 150, sm: 180, md: 220 }, 
                  borderRadius: "50%",
                  objectFit: "cover",
                  mb: 3,
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)', 
                }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                color="var(--purple-maincolor)"
                sx={{ fontSize: { xs: '1.3rem', md: '1.3rem' } }} 
              >
                Diogo Branquinho
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '1.1rem', md: '1rem' } }}
              >
                Diretor Executivo e Cofundador
              </Typography>
            </Box>

            <Box sx={{ 
              textAlign: "center", 
              maxWidth: { xs: 200, sm: 250, md: 300 }, 
              p: 2 
            }}>
              <Box
                component="img"
                src={Tatiana}
                alt="Tatiana Morelli"
                sx={{
                  width: { xs: 150, sm: 180, md: 220 },
                  height: { xs: 150, sm: 180, md: 220 },
                  borderRadius: "50%",
                  objectFit: "cover",
                  mb: 3,
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                color="var(--purple-maincolor)"
                sx={{ fontSize: { xs: '1.3rem', md: '1.3rem' } }}
              >
                Tatiana Morelli
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '1rem', md: '1rem' } }}
              >
                Diretora Administrativa
              </Typography>
            </Box>

            <Box sx={{ 
              textAlign: "center", 
              maxWidth: { xs: 200, sm: 250, md: 300 }, 
              p: 2 
            }}>
              <Box
                component="img"
                src={Diego}
                alt="Diego Palharini"
                sx={{
                  width: { xs: 150, sm: 180, md: 220 },
                  height: { xs: 150, sm: 180, md: 220 },
                  borderRadius: "50%",
                  objectFit: "cover",
                  mb: 3,
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Typography
                variant="h6"
                fontWeight="bold"
                color="var(--purple-maincolor)"
                sx={{ fontSize: { xs: '1.3rem', md: '1.3rem' } }}
              >
                Diego Palharini
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '1rem', md: '1rem' } }}
              >
                Gerente de Produto
              </Typography>
            </Box>
          </Box>
      </Container>
    </DefaultLayout>
  );
}