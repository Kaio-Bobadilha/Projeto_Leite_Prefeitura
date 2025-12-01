FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y netcat-openbsd gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo o código para /app
COPY . .

# --- CORREÇÃO AQUI ---
# 1. Copia o script explicitamente para a raiz
COPY entrypoint.sh /entrypoint.sh

# 2. Corrige quebras de linha do Windows (caso existam) e dá permissão de execução
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]