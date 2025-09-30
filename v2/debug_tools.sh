#!/bin/bash

# Script de ferramentas de debugging para o projeto Leite MVP
# Uso: ./debug_tools.sh [comando]

BASE_URL="http://localhost:8080"
LOG_DIR="/home/ubuntu/projeto_leite_mvp/logs"

show_help() {
    echo "🔧 Ferramentas de Debug - Projeto Leite MVP"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  status          - Verificar status do servidor"
    echo "  logs [n]        - Mostrar últimos n logs (padrão: 10)"
    echo "  errors [n]      - Mostrar últimos n erros (padrão: 5)"
    echo "  info            - Informações do sistema"
    echo "  test-login      - Testar endpoint de login"
    echo "  test-cadastro   - Testar endpoint de cadastro"
    echo "  monitor         - Monitorar logs em tempo real"
    echo "  rotate-logs     - Rotacionar arquivos de log"
    echo "  tail-logs       - Acompanhar logs em tempo real"
    echo "  server-info     - Informações detalhadas do servidor"
    echo "  help            - Mostrar esta ajuda"
    echo ""
}

check_server() {
    if ! curl -s "$BASE_URL/api/status" > /dev/null 2>&1; then
        echo " Servidor não está respondendo em $BASE_URL"
        echo "   Verifique se o servidor está rodando:"
        echo "   cd /home/ubuntu/projeto_leite_mvp/back"
        echo "   export PATH=\"\$PATH:/usr/lib/dart/bin\""
        echo "   dart run bin/server_with_logging.dart"
        exit 1
    fi
}

show_status() {
    echo " Status do Servidor"
    echo "### xablau ###"
    check_server
    curl -s "$BASE_URL/api/status" | python3 -m json.tool 2>/dev/null || echo "Erro ao obter status"
    echo ""
}

show_logs() {
    local lines=${1:-10}
    echo "#### Últimos $lines logs"
    echo "### xablau ###"
    check_server
    curl -s "$BASE_URL/api/debug/logs?lines=$lines" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        for log in data['logs']:
            log_data = json.loads(log)
            timestamp = log_data['timestamp'][:19]
            level = log_data['level']
            message = log_data['message']
            print(f'[{timestamp}] [{level}] {message}')
            if 'context' in log_data:
                context = log_data['context']
                if 'error' in context:
                    print(f'    Error: {context[\"error\"]}')
                elif 'method' in context and 'url' in context:
                    print(f'    {context[\"method\"]} {context[\"url\"]}')
    else:
        print('Erro ao obter logs')
except:
    print('Erro ao processar logs')
"
    echo ""
}

show_errors() {
    local lines=${1:-5}
    echo " ### !!! Últimos $lines erros"
    echo "### xablau ###"
    check_server
    curl -s "$BASE_URL/api/debug/errors?lines=$lines" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        if data['errors']:
            for error in data['errors']:
                error_data = json.loads(error)
                timestamp = error_data['timestamp'][:19]
                level = error_data['level']
                message = error_data['message']
                print(f'[{timestamp}] [{level}] {message}')
                if 'context' in error_data:
                    context = error_data['context']
                    if 'error' in context:
                        print(f'    Error: {context[\"error\"]}')
                if 'stackTrace' in error_data:
                    print(f'    Stack: {error_data[\"stackTrace\"][:200]}...')
                print()
        else:
            print('--- > Nenhum erro encontrado!')
    else:
        print('Erro ao obter erros, daí F')
except:
    print('Erro ao processar erros')
"
    echo ""
}

show_info() {
    echo " iiiiii  Informações do Sistema"
    echo "### xablau ###"
    check_server
    curl -s "$BASE_URL/api/debug/info" | python3 -m json.tool 2>/dev/null || echo "Erro ao obter informações"
    echo ""
}

test_login() {
    echo " Testando Login"
    echo "### xablau ###"
    check_server
    echo "Testando login com admin/123..."
    response=$(curl -s -X POST "$BASE_URL/api/login" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"123"}')
    
    echo "$response" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print(' !!! Login bem-sucedido!')
        print(f'   Usuário: {data[\"user\"][\"name\"]} ({data[\"user\"][\"type\"]})')
        print(f'   Token: {data[\"token\"][:50]}...')
    else:
        print('!!! ### !!! Login falhou!')
        print(f'   Erro: {data.get(\"message\", \"Erro desconhecido\")}')
except:
    print(' ### xablau ### Erro ao processar resposta do login')
"
    echo ""
}

test_cadastro() {
    echo "--- > Testando Cadastro"
    echo "### xablau ###"
    check_server
    echo "Testando cadastro de produtor..."
    response=$(curl -s -X POST "$BASE_URL/api/cadastro" \
        -H "Content-Type: application/json" \
        -d '{
            "pessoa": "fisica",
            "tipoUsuario": "Produtor",
            "cpfCnpj": "12345678901",
            "razaoSocial": "João Silva",
            "nomeFantasia": "Fazenda Silva",
            "endereco": {
                "logradouro": "Rua das Flores, 123",
                "municipio": "Toledo",
                "uf": "PR"
            }
        }')
    
    echo "$response" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print(' ### Cadastro bem-sucedido!')
        print(f'   ID: {data.get(\"id\")}')
        print(f'   Mensagem: {data.get(\"message\")}')
    else:
        print(' !!! F !!! Cadastro falhou!')
        print(f'   Erro: {data.get(\"message\", \"Erro desconhecido\")}')
except:
    print(' !!! F !!! Erro ao processar resposta do cadastro')
"
    echo ""
}

monitor_logs() {
    echo " ---> Monitorando logs em tempo real (Ctrl+C para sair)"
    echo "xa.........................................................blau"
    check_server
    
    while true; do
        clear
        echo " ###  $(date '+%Y-%m-%d %H:%M:%S') - Logs em tempo real"
        echo "xa.........................................................blau"
        show_logs 5
        sleep 2
    done
}

rotate_logs() {
    echo " --- > Rotacionando logs"
    echo "### xablau ###"
    check_server
    response=$(curl -s -X POST "$BASE_URL/api/debug/rotate-logs")
    echo "$response" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print(' Logs rotacionados com sucesso!')
    else:
        print(' !!! F !!! Erro na rotação de logs!')
        print(f'   Erro: {data.get(\"message\")}')
except:
    print(' !!! F !!! Erro ao processar resposta')
"
    echo ""
}

tail_logs() {
    echo " Acompanhando logs do arquivo (Ctrl+C para sair)"
    echo "xa.........................................................blau"
    if [ -f "$LOG_DIR/app_$(date +%Y-%m-%d).log" ]; then
        tail -f "$LOG_DIR/app_$(date +%Y-%m-%d).log" | while read line; do
            echo "$line" | python3 -c "
import json, sys
try:
    data = json.loads(input())
    timestamp = data['timestamp'][:19]
    level = data['level']
    message = data['message']
    print(f'[{timestamp}] [{level}] {message}')
except:
    print(input())
"
        done
    else
        echo " FFFFF Arquivo de log não encontrado: $LOG_DIR/app_$(date +%Y-%m-%d).log"
    fi
}

server_info() {
    echo " --- > i < ---  Informações Detalhadas do Servidor"
    echo "xa.........................................................blau"
    check_server
    
    echo "---> Status:"
    show_status
    
    echo " --- --- --- > Arquivos de Log:"
    ls -la "$LOG_DIR/" 2>/dev/null || echo "Diretório de logs não encontrado"
    echo ""
    
    echo " ... Processos Dart:"
    ps aux | grep dart | grep -v grep || echo "Nenhum processo Dart encontrado"
    echo ""
    
    echo " ... Portas em uso:"
    netstat -tlnp 2>/dev/null | grep :8080 || echo "Porta 8080 não está em uso"
    echo ""
}

# Processar comando
case "${1:-help}" in
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "errors")
        show_errors "$2"
        ;;
    "info")
        show_info
        ;;
    "test-login")
        test_login
        ;;
    "test-cadastro")
        test_cadastro
        ;;
    "monitor")
        monitor_logs
        ;;
    "rotate-logs")
        rotate_logs
        ;;
    "tail-logs")
        tail_logs
        ;;
    "server-info")
        server_info
        ;;
    "help"|*)
        show_help
        ;;
esac
