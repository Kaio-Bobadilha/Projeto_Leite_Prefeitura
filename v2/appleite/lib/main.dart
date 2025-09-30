import 'package:flutter/material.dart';
import 'pages/login.dart';
import 'pages/home.dart';
import 'services/api_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Inicializar serviço de API
  await ApiService().initialize();
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  bool _isLoggedIn() {
    return ApiService().isLoggedIn;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sistema de Gestão de Produtores de Leite',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.green),
      home: _isLoggedIn() ? const HomePage() : const LoginPage(),
    );
  }
}
