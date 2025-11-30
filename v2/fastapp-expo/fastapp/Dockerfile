FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Configurações para evitar erros de versão e instalar dependências
RUN npm config set legacy-peer-deps true
RUN npm install --legacy-peer-deps

# Instalar dependências do Expo Web e o datetimepicker que faltava
RUN npx expo install react-native-web react-dom @expo/metro-runtime -- --legacy-peer-deps
RUN npm install @react-native-community/datetimepicker --legacy-peer-deps

COPY . .

ENV CI=1

EXPOSE 8081

# Comando correto para Expo 50+
CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "lan"]