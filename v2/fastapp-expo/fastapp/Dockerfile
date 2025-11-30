FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Configurações para evitar erros de versão
RUN npm config set legacy-peer-deps true
RUN npm install --legacy-peer-deps

# Instala dependências do Expo Web e Axios
RUN npx expo install react-native-web react-dom @expo/metro-runtime -- --legacy-peer-deps
RUN npm install @react-native-community/datetimepicker axios --legacy-peer-deps

# CORREÇÃO AQUI: Copiar tudo para o diretório atual
COPY . .

ENV CI=1

EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "lan"]