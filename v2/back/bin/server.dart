import 'dart:io';
import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart';
import 'package:shelf_router/shelf_router.dart';
import 'package:shelf_cors_headers/shelf_cors_headers.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';

// Mock databas
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
  final jwt = JWT({
    'username': username,
    'exp': DateTime.now().add(Duration(hours: 24)).millisecondsSinceEpoch ~/ 1000
  });
  return jwt.sign(SecretKey('minha_chave_secreta'));
}

bool validateToken(String token) {
  try {
    JWT.verify(token, SecretKey('minha_chave_secreta'));
    return true;
  } catch (e) {
    return false;
  }
}

void main() async {
  final router = Router();

  // Middleware para CORS
  final handler = Pipeline()
      .addMiddleware(corsHeaders())
      .addMiddleware(logRequests())
      .addHandler(router);

  // Endpoint de login
  router.post('/api/login', (Request request) async {
    try {
      final body = await request.readAsString();
      final data = jsonDecode(body);
      
      final username = data['username'];
      final password = data['password'];
      
      if (users.containsKey(username) && users[username]!['password'] == password) {
        final token = generateToken(username);
        return Response.ok(
          jsonEncode({
            'success': true,
            'token': token,
            'user': {
              'username': username,
              'name': users[username]!['name'],
              'email': users[username]!['email'],
              'type': users[username]!['type']
            }
          }),
          headers: {'Content-Type': 'application/json'}
        );
      } else {
        return Response(401, 
          body: jsonEncode({'success': false, 'message': 'Credenciais inválidas'}),
          headers: {'Content-Type': 'application/json'}
        );
      }
    } catch (e) {
      return Response(400,
        body: jsonEncode({'success': false, 'message': 'Dados inválidos'}),
        headers: {'Content-Type': 'application/json'}
      );
    }
  });

  // Endpoint de cadastro de produtores
  router.post('/api/cadastro', (Request request) async {
    try {
      final body = await request.readAsString();
      final data = jsonDecode(body);
      
      // Simular validação e salvamento
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
      
      return Response.ok(
        jsonEncode({
          'success': true,
          'message': 'Cadastro realizado com sucesso',
          'id': novoProdutor['id']
        }),
        headers: {'Content-Type': 'application/json'}
      );
    } catch (e) {
      return Response(400,
        body: jsonEncode({'success': false, 'message': 'Erro no cadastro: $e'}),
        headers: {'Content-Type': 'application/json'}
      );
    }
  });

  // Endpoint para listar produtores
  router.get('/api/produtores', (Request request) {
    return Response.ok(
      jsonEncode({'success': true, 'data': produtores}),
      headers: {'Content-Type': 'application/json'}
    );
  });

  // Endpoint para histórico
  router.get('/api/historico', (Request request) {
    return Response.ok(
      jsonEncode({'success': true, 'data': historico}),
      headers: {'Content-Type': 'application/json'}
    );
  });

  // Endpoint para relatórios
  router.get('/api/relatorios', (Request request) {
    final relatorios = {
      'totalProdutores': produtores.length,
      'totalLaticinios': laticinios.length,
      'entregas': historico.length,
      'volumeTotal': historico.fold(0.0, (sum, item) => sum + (item['quantidade'] as num)),
      'ultimaAtualizacao': DateTime.now().toIso8601String()
    };
    
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
        'timestamp': DateTime.now().toIso8601String()
      }),
      headers: {'Content-Type': 'application/json'}
    );
  });

  // Iniciar servidor
  final server = await serve(handler, InternetAddress.anyIPv4, 8080);
  print('Servidor rodando em http://${server.address.host}:${server.port}');
  print('Endpoints disponíveis:');
  print('  POST /api/login');
  print('  POST /api/cadastro');
  print('  GET  /api/produtores');
  print('  GET  /api/historico');
  print('  GET  /api/relatorios');
  print('  GET  /api/status');
}
