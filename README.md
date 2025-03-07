# Projeto API 2025.1 Frontend

Este é o projeto frontend da aplicação **API 2025.1**, desenvolvido com **React**, **TypeScript**, e **Vite**.

## Pré-requisitos

Antes de rodar o projeto, você precisa garantir que as seguintes ferramentas estejam instaladas:

- [Node.js](https://nodejs.org/) (recomenda-se a versão LTS)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)

### Instalando o Node.js e npm

Se você ainda não tem o Node.js instalado, siga os passos abaixo para instalá-lo:

1. Acesse o site oficial do [Node.js](https://nodejs.org/).
2. Faça o download da versão LTS (Long Term Support).
3. Após a instalação, verifique se o Node.js e o npm estão corretamente instalados executando os seguintes comandos no terminal:

   ```bash
   node -v
   npm -v
   ```
## Clonando o Repositório

   ```bash
   git clone https://github.com/Code-Nine-FTC/API-2025.1-Frontend.git
  ```
### Entre na pasta do projeto:
```bash
cd API-2025.1-Frontend
```

## Instalando Dependências

Após clonar o repositório, instale as dependências do projeto com o npm:

```bash
npm install
```

Este comando vai instalar todas as bibliotecas e dependências necessárias para rodar o projeto.

## Rodando o Projeto
Para rodar o projeto em modo de desenvolvimento, utilize o seguinte comando:

```bash
npm run dev
```

Isso irá iniciar o servidor de desenvolvimento e abrir o aplicativo no navegador. O Vite irá compilar o código e você verá as mudanças em tempo real enquanto faz alterações.

## Scripts

Aqui estão os principais scripts disponíveis no projeto:

- ```npm run dev```: Inicia o servidor de desenvolvimento (Vite).

- ```npm run build```: Cria uma versão otimizada para produção.

- ```npm run preview```: Serve a versão de produção gerada pelo comando build.

## Configurações do Projeto

O projeto utiliza o Vite como bundler e o TypeScript como linguagem de desenvolvimento. A estrutura de diretórios está organizada da seguinte maneira:

- ```src/```: Contém todos os arquivos de código-fonte.

- ```src/pages/```: Páginas do aplicativo.

- ```src/routes/```: Definição de rotas da aplicação.

- ```vite.config.ts```: Arquivo de configuração do Vite.

- ```tsconfig.json```: Arquivo de configuração do TypeScript.

- ```tsconfig.app.json```: Configuração adicional para o frontend.


