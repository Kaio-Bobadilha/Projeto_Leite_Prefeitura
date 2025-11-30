FROM node:18-alpine

WORKDIR /app

# Copiar definições de dependências
COPY package*.json ./

# Instalar dependências
RUN npm config set legacy-peer-deps true

RUN npm install --legacy-peer-deps

# Instalar dependências web necessárias para o Expo rodar no Docker
RUN npx expo install react-native-web react-dom @expo/metro-runtime -- --legacy-peer-deps

# Copiar o código fonte
COPY . .

# Expor a porta
EXPOSE 8081

# Iniciar o Expo Web
CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "lan"]