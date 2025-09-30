import 'dart:io';
import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';

// Importar utilitários de logging
import '../lib/utils/logger.dart';
import '../lib/middleware/debug_middleware.dart';

// Mock 
final Map<String, Map<String, dynamic>> users = {
  'admin': {
    'password': '123',
    'name': 'Administrador',
    'email': 'admin@prefeitura.com',
    'type': 'Admin'
  },
  'produtor1': {
    'password': '123',
    'name': 'João Silva',
    'email': 'joao@fazenda.com',
    'type': 'Produtor'
  }
};

final List<Map<String, dynamic>> produtores = [];
final List<Map<String, dynamic>> laticinios = [];
final List<Map<String, dynamic>> historico = [
  {
    'id': 1,
    'data': '2024-09-25',
    'produtor': 'João Silva',
    'quantidade': 150.5,
    'laticinio': 'Laticínio Central',
    'status': 'Entregue'
  },
  {
    'id': 2,
    'data': '2024-09-24',
    'produtor': 'Maria Santos',
    'quantidade': 200.0,
    'laticinio': 'Laticínio Norte',
    'status': 'Pendente'
  }
];

String generateToken(String username) {
  final logger = Logger.instance;
  logger.debug('Gerando token JWT', {'username': username});
  
  final jwt = JWT({
    'username': username,
    'exp': DateTime.now().add(Duration(hours: 24)).millisecondsSinceEpoch ~/ 1000,
    'iat': DateTime.now().millisecondsSinceEpoch ~/ 1000,
  });
  
  final token = jwt.sign(SecretKey('minha_chave_secreta'));
  logger.info('Token JWT gerado com sucesso', {'username': username, 'tokenLength': token.length});
  
  return token;
}

bool validateToken(String token) {
  final logger = Logger.instance;
  try {
    final jwt = JWT.verify(token, SecretKey('minha_chave_secreta'));
    logger.debug('Token validado com sucesso', {'username': jwt.payload['username']});
    return true;
  } catch (e) {
    logger.warning('Falha na validação do token', {'error': e.toString()});
    return false;
  }
}

void main() async {
  // Inicializar sistema de logging
  final logger = Logger.instance;
  await logger.initialize(level: LogLevel.debug);
  
  logger.info('Iniciando servidor do sistema de gestão de produtores de leite');

  final router = Router();

  // Configurar pipeline de middleware
  final handler = Pipeline()
      .addMiddleware(corsHeaders())
      .addMiddleware(DebugMiddleware.errorHandler())
      .addMiddleware(DebugMiddleware.requestLogger())
      .addMiddleware(DebugMiddleware.performanceMonitor(slowRequestThreshold: 500))
      .addMiddleware(RequestBodyCapture.capture())
      .addHandler(router);

  // Endpoint de login
  router.post('/api/login', (Request request) async {
    logger.info('Tentativa de login recebida');
    
    try {
      final body = await request.readAsString();
      final data = jsonDecode(body);
      
      final username = data['username'];
      final password = data['password'];
      
      logger.debug('Dados de login processados', {'username': username});
      
      if (users.containsKey(username) && users[username]!['password'] == password) {
        final token = generateToken(username);
        final user = users[username]!;
        
        logger.info('Login bem-sucedido', {
          'username': username,
          'userType': user['type'],
          'timestamp': DateTime.now().toIso8601String()
        });
        
        return Response.ok(
          jsonEncode({
            'success': true,
            'token': token,
            'user': {
              'username': username,
              'name': user['name'],
              'email': user['email'],
              'type': user['type']
            }
          }),
          headers: {'Content-Type': 'application/json'}
        );
      } else {
        logger.warning('Tentativa de login falhada', {
          'username': username,
          'reason': 'credenciais_invalidas',
          'timestamp': DateTime.now().toIso8601String()
        });
        
        return Response(401, 
          body: jsonEncode({'success': false, 'message': 'Credenciais inválidas'}),
          headers: {'Content-Type': 'application/json'}
        );
      }
    } catch (e, stackTrace) {
      logger.error('Erro no processamento do login', {'error': e.toString()}, stackTrace);
      
      return Response(400,
        body: jsonEncode({'success': false, 'message': 'Dados inválidos'}),
        headers: {'Content-Type': 'application/json'}
      );
    }
  });

  // Endpoint de cadastro de produtores
  router.post('/api/cadastro', (Request request) async {
    logger.info('Nova solicitação de cadastro recebida');
    
    try {
      final body = await request.readAsString();
      final data = jsonDecode(body);
      
      logger.debug('Dados de cadastro recebidos', {
        'tipoUsuario': data['tipoUsuario'],
        'pessoa': data['pessoa'],
        'hasEndereco': data['endereco'] != null
      });
      
      // teste
      final novoProdutor = {
        'id': produtores.length + 1,
        'pessoa': data['pessoa'],
        'tipoUsuario': data['tipoUsuario'],
        'cpfCnpj': data['cpfCnpj'],
        'razaoSocial': data['razaoSocial'],
        'nomeFantasia': data['nomeFantasia'],
        'endereco': data['endereco'],
        'dataCadastro': DateTime.now().toIso8601String()
      };
      
      produtores.add(novoProdutor);
      
      logger.info('Cadastro realizado com sucesso', {
        'id': novoProdutor['id'],
        'tipoUsuario': data['tipoUsuario'],
        'totalProdutores': produtores.length
      });
      
      return Response.ok(
        jsonEncode({
          'success': true,
          'message': 'Cadastro realizado com sucesso',
          'id': novoProdutor['id']
        }),
        headers: {'Content-Type': 'application/json'}
      );
    } catch (e, stackTrace) {
      logger.error('Erro no processamento do cadastro', {'error': e.toString()}, stackTrace);
      
      return Response(400,
        body: jsonEncode({'success': false, 'message': 'Erro no cadastro: $e'}),
        headers: {'Content-Type': 'application/json'}
      );
    }
  });

  // Endpoint para listar produtores
  router.get('/api/produtores', (Request request) {
    logger.debug('Listagem de produtores solicitada', {'total': produtores.length});
    
    return Response.ok(
      jsonEncode({'success': true, 'data': produtores}),
      headers: {'Content-Type': 'application/json'}
    );
  });

  // Endpoint para histórico
  router.get('/api/historico', (Request request) {
    logger.debug('Histórico solicitado', {'totalRegistros': historico.length});
    
    return Response.ok(
      jsonEncode({'success': true, 'data': historico}),
      headers: {'Content-Type': 'application/json'}
    );
  });

  // Endpoint para relatórios
  router.get('/api/relatorios', (Request request) {
    logger.debug('Relatórios solicitados');
    
    final relatorios = {
      'totalProdutores': produtores.length,
      'totalLaticinios': laticinios.length,
      'entregas': historico.length,
      'volumeTotal': historico.fold(0.0, (sum, item) => sum + (item['quantidade'] as num)),
      'ultimaAtualizacao': DateTime.now().toIso8601String()
    };
    
    logger.info('Relatórios gerados', relatorios);
    
    return Response.ok(
      jsonEncode({'success': true, 'data': relatorios}),
      headers: {'Content-Type': 'application/json'}
    );
  });

  // Endpoint de status
  router.get('/api/status', (Request request) {
    return Response.ok(
      jsonEncode({
        'status': 'online',
        'version': '1.0.0',
        'timestamp': DateTime.now().toIso8601String(),
        'uptime': DateTime.now().difference(DateTime.now()).inSeconds,
        'totalProdutores': produtores.length,
        'totalUsuarios': users.length
      }),
      headers: {'Content-Type': 'application/json'}
    );
  });

  // Endpoints de debugging e monitoramento
  router.get('/api/debug/info', (Request request) async {
    logger.debug('Informações de debug solicitadas');
    
    final dumpInfo = await logger.getDumpInfo();
    return Response.ok(dumpInfo, headers: {'Content-Type': 'application/json'});
  });

  router.get('/api/debug/logs', (Request request) async {
    final lines = int.tryParse(request.url.queryParameters['lines'] ?? '50') ?? 50;
    logger.debug('Logs recentes solicitados', {'lines': lines});
    
    final logs = await logger.getRecentLogs(lines: lines);
    return Response.ok(
      jsonEncode({'success': true, 'logs': logs}),
      headers: {'Content-Type': 'application/json'}
    );
  });

  router.get('/api/debug/errors', (Request request) async {
    final lines = int.tryParse(request.url.queryParameters['lines'] ?? '20') ?? 20;
    logger.debug('Erros recentes solicitados', {'lines': lines});
    
    final errors = await logger.getRecentErrors(lines: lines);
    return Response.ok(
      jsonEncode({'success': true, 'errors': errors}),
      headers: {'Content-Type': 'application/json'}
    );
  });

  // Endpoint para rotacionar logs
  router.post('/api/debug/rotate-logs', (Request request) async {
    logger.info('Rotação de logs solicitada');
    
    try {
      await logger.rotateLogs();
      logger.info('Rotação de logs concluída com sucesso');
      
      return Response.ok(
        jsonEncode({'success': true, 'message': 'Logs rotacionados com sucesso'}),
        headers: {'Content-Type': 'application/json'}
      );
    } catch (e, stackTrace) {
      logger.error('Erro na rotação de logs', {'error': e.toString()}, stackTrace);
      
      return Response(500,
        body: jsonEncode({'success': false, 'message': 'Erro na rotação de logs'}),
        headers: {'Content-Type': 'application/json'}
      );
    }
  });

  // Iniciar servidor
  try {
    final server = await serve(handler, InternetAddress.anyIPv4, 8080);
    
    logger.info('Servidor iniciado com sucesso', {
      'host': server.address.host,
      'port': server.port,
      'pid': pid
    });
    
    print(' Servidor rodando em http://${server.address.host}:${server.port}');
    print(' Endpoints de API:');
    print('  POST /api/login');
    print('  POST /api/cadastro');
    print('  GET  /api/produtores');
    print('  GET  /api/historico');
    print('  GET  /api/relatorios');
    print('  GET  /api/status');
    print(' Endpoints de Debug:');
    print('  GET  /api/debug/info');
    print('  GET  /api/debug/logs?lines=50');
    print('  GET  /api/debug/errors?lines=20');
    print('  POST /api/debug/rotate-logs');
    print(' Logs salvos em: /home/ubuntu/projeto_leite_mvp/logs/');
    
  } catch (e, stackTrace) {
    logger.critical('Falha ao iniciar servidor', {'error': e.toString()}, stackTrace);
    exit(1);
  }
}
