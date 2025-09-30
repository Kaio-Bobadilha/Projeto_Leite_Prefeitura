Para iniciar o sistema:
Backend: cd back && dart run bin/server_with_logging.dart
Frontend: cd appleite && flutter run -d web-server --web-port 3000

Credenciais de teste:
Admin: admin / 123
Produtor: produtor1 / 123

Ferramentas de debug:
./debug_tools.sh status - Status do servidor
./debug_tools.sh test-login - Testar autenticação
./debug_tools.sh monitor - Monitorar logs em tempo real