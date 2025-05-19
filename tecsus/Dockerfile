# Usa a imagem do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia os arquivos do projeto para o contêiner
COPY . .

# Gera a versão de produção
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Define a porta que o contêiner vai expor
EXPOSE 5173

# Comando para rodar a aplicação
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
