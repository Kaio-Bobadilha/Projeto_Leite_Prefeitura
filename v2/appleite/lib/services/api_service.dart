import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://10.200.74.215:8080/api';

  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _token;
  Map<String, dynamic>? _currentUser;

  // Getters
  String? get token => _token;
  Map<String, dynamic>? get currentUser => _currentUser;
  bool get isLoggedIn => _token != null;

  // Headers padrão
  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  // Inicializar serviço (carregar token salvo)
  Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    final userJson = prefs.getString('current_user');
    if (userJson != null) {
      _currentUser = jsonDecode(userJson);
    }
  }

  // Salvar dados de autenticação
  Future<void> _saveAuthData(String token, Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    await prefs.setString('current_user', jsonEncode(user));
    await prefs.setBool('loggedIn', true);

    _token = token;
    _currentUser = user;
  }

  // Limpar dados de autenticação
  Future<void> _clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('current_user');
    await prefs.setBool('loggedIn', false);

    _token = null;
    _currentUser = null;
  }

  // Login
  Future<ApiResponse<Map<String, dynamic>>> login(
      String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        await _saveAuthData(data['token'], data['user']);
        return ApiResponse.success(data);
      } else {
        return ApiResponse.error(data['message'] ?? 'Erro no login');
      }
    } catch (e) {
      return ApiResponse.error('Erro de conexão: $e');
    }
  }

  // Logout
  Future<void> logout() async {
    await _clearAuthData();
  }

  // Cadastro
  Future<ApiResponse<Map<String, dynamic>>> cadastro(
      Map<String, dynamic> dadosCadastro) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/cadastro'),
        headers: _headers,
        body: jsonEncode(dadosCadastro),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return ApiResponse.success(data);
      } else {
        return ApiResponse.error(data['message'] ?? 'Erro no cadastro');
      }
    } catch (e) {
      return ApiResponse.error('Erro de conexão: $e');
    }
  }

  // Listar produtores
  Future<ApiResponse<List<dynamic>>> getProdutores() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/produtores'),
        headers: _headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return ApiResponse.success(data['data']);
      } else {
        return ApiResponse.error(
            data['message'] ?? 'Erro ao carregar produtores');
      }
    } catch (e) {
      return ApiResponse.error('Erro de conexão: $e');
    }
  }

  // Obter histórico
  Future<ApiResponse<List<dynamic>>> getHistorico() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/historico'),
        headers: _headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return ApiResponse.success(data['data']);
      } else {
        return ApiResponse.error(
            data['message'] ?? 'Erro ao carregar histórico');
      }
    } catch (e) {
      return ApiResponse.error('Erro de conexão: $e');
    }
  }

  // Obter relatórios
  Future<ApiResponse<Map<String, dynamic>>> getRelatorios() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/relatorios'),
        headers: _headers,
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        return ApiResponse.success(data['data']);
      } else {
        return ApiResponse.error(
            data['message'] ?? 'Erro ao carregar relatórios');
      }
    } catch (e) {
      return ApiResponse.error('Erro de conexão: $e');
    }
  }

  // Verificar status do servidor
  Future<ApiResponse<Map<String, dynamic>>> getStatus() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/status'),
        headers: {'Content-Type': 'application/json'},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return ApiResponse.success(data);
      } else {
        return ApiResponse.error('Servidor indisponível');
      }
    } catch (e) {
      return ApiResponse.error('Erro de conexão: $e');
    }
  }
}

// Classe para padronizar respostas da API
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? error;

  ApiResponse.success(this.data)
      : success = true,
        error = null;
  ApiResponse.error(this.error)
      : success = false,
        data = null;
}
