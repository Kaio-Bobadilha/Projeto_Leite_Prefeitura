import 'package:flutter/material.dart';
import 'login.dart';
import 'usuarios.dart';
import 'historico.dart';
import 'relatorios.dart';
import 'cadastro.dart';
import 'comprovante_page.dart';
import 'registro_coleta_page.dart'; // <-- 1. IMPORT ADICIONADO
import '../services/api_service.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  Future<void> _logout(BuildContext context) async {
    // Acessando o singleton da forma correta
    await ApiService().logout();
    if (context.mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LoginPage()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Acessando o singleton da forma correta
    final user = ApiService().currentUser;
    final userName = user?['name'] ?? 'Usuário';
    final userType = user?['type'] ?? 'Desconhecido';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sistema de Gestão de Leite'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _logout(context),
            tooltip: 'Sair',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cabeçalho de boas-vindas
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: Theme.of(context).primaryColor,
                      child: Text(
                        userName.isNotEmpty ? userName[0].toUpperCase() : 'U',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Bem-vindo, $userName!',
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          Text(
                            'Tipo: $userType',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(
                                  color: Colors.grey[600],
                                ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            Text(
              'Menu Principal',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),

            const SizedBox(height: 16),

            // Grid de opções
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildMenuCard(
                    context,
                    'Cadastro',
                    'Cadastrar novos produtores',
                    Icons.person_add,
                    Colors.blue,
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const RegisterPage()),
                    ),
                  ),
                  // BOTÃO ADICIONADO AQUI
                  _buildMenuCard(
                    context,
                    'Registrar Coleta',
                    'Lançar nova coleta de leite',
                    Icons.add_location_alt,
                    Colors.teal,
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const RegistroColetaPage()),
                    ),
                  ),
                  _buildMenuCard(
                    context,
                    'Histórico',
                    'Ver histórico de entregas',
                    Icons.history,
                    Colors.green,
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const HistoricoPage()),
                    ),
                  ),
                  _buildMenuCard(
                    context,
                    'Relatórios',
                    'Visualizar relatórios',
                    Icons.analytics,
                    Colors.orange,
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const RelatoriosPage()),
                    ),
                  ),
                  _buildMenuCard(
                    context,
                    'Gerar Comprovante',
                    'Criar PDF de uma coleta',
                    Icons.receipt,
                    Colors.red,
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const ComprovantePage()),
                    ),
                  ),
                  _buildMenuCard(
                    context,
                    'Perfil',
                    'Ver informações do usuário',
                    Icons.person,
                    Colors.purple,
                    () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const UserPage()),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuCard(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: color,
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
