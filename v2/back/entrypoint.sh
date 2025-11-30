#!/bin/sh

set -e

echo "A aguardar pelo PostgreSQL..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL iniciado!"

# --- AUTOMAÇÃO DA BRANCH DEV ---
echo "A verificar mudanças nos modelos (makemigrations)..."
python manage.py makemigrations --noinput

echo "A aplicar migrações ao banco de dados (migrate)..."
python manage.py migrate --noinput

echo "A recolher ficheiros estáticos..."
python manage.py collectstatic --noinput

echo "A iniciar servidor Django..."
exec python manage.py runserver 0.0.0.0:8000