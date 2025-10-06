import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'login.dart';

class UserPage extends StatelessWidget {
  const UserPage({super.key});

  Future<void> _logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove("loggedIn");
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const LoginPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    // Aqui você pode buscar dados reais do usuário no backend ou no SharedPreferences
    const String nome = "Victor";
    const String email = "victor@email.com";

    return Scaffold(
      appBar: AppBar(title: const Text("Perfil do Usuário")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const CircleAvatar(radius: 40, child: Icon(Icons.person, size: 50)),
            const SizedBox(height: 20),
            Text("Nome: $nome", style: const TextStyle(fontSize: 18)),
            Text("E-mail: $email", style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 30),
            Center(
              child: ElevatedButton(
                onPressed: () => _logout(context),
                child: const Text("Sair"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
