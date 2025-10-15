import 'package:flutter/material.dart';
import '../services/api_service.dart';

class RegistroColetaPage extends StatefulWidget {
  const RegistroColetaPage({super.key});

  @override
  State<RegistroColetaPage> createState() => _RegistroColetaPageState();
}

class _RegistroColetaPageState extends State<RegistroColetaPage> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  bool _isLoading = false;

  // Controladores para os campos do formulário
  final _temperaturaController = TextEditingController();
  final _alizarolController = TextEditingController();

  // Dados de exemplo - no futuro, viriam do login (motorista) e de uma seleção (produtor)
  final String _idProdutor = 'produtor1';
  final String _nomeProdutor = 'João Silva';
  final String _idMotorista = 'motorista_logado';
  final String _nomeMotorista = 'Élio Fernandes';
  final String _placaVeiculo = 'AOP-3138';

  Future<void> _salvarColeta() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      final dadosColeta = {
        'idProdutor': _idProdutor,
        'nomeProdutor': _nomeProdutor,
        'idMotorista': _idMotorista,
        'nomeMotorista': _nomeMotorista,
        'placaVeiculo': _placaVeiculo,
        'temperatura': double.tryParse(_temperaturaController.text) ?? 0.0,
        'alizarol': _alizarolController.text,
      };

      try {
        await _apiService.registrarColeta(dadosColeta);

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Coleta registrada com sucesso!'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context); // Volta para a tela anterior
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Erro: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Registrar Nova Coleta'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Produtor: $_nomeProdutor',
                  style: const TextStyle(fontSize: 18)),
              const SizedBox(height: 8),
              Text('Motorista: $_nomeMotorista',
                  style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 24),
              TextFormField(
                controller: _temperaturaController,
                decoration: const InputDecoration(
                  labelText: 'Temperatura (°C)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.thermostat),
                ),
                keyboardType:
                    const TextInputType.numberWithOptions(decimal: true),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor, informe a temperatura';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _alizarolController,
                decoration: const InputDecoration(
                  labelText: 'Teste de Alizarol (°GL)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.science_outlined),
                ),
                keyboardType: TextInputType.text,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor, informe o resultado do Alizarol';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _salvarColeta,
                icon: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.save),
                label: const Text('Salvar Coleta'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  textStyle: const TextStyle(fontSize: 18),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
