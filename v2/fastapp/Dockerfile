# Usar imagem Node leve
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm install --legacy-peer-deps
RUN npm install -g @expo/ngrok

# Copiar o restante do código
COPY . .

# Expor a porta usada pelo Expo/Metro (padrão web ou mobile dev)
EXPOSE 8080

# Comando para iniciar (ajustado para web conforme seu docker-compose sugere ambiente dev)
CMD ["npx", "expo", "start", "--web", "--tunnel"]