import '../services/pdf_service.dart'; // <-- AQUI ESTÁ A IMPORTAÇÃO
import 'package:flutter/material.dart';

class ComprovantePage extends StatefulWidget {
  const ComprovantePage({super.key});

  @override
  State<ComprovantePage> createState() => _ComprovantePageState();
}

class _ComprovantePageState extends State<ComprovantePage> {
  // 1. Criamos uma instância do seu serviço
  final PdfService _pdfService = PdfService();
  bool _isLoading = false;

  // Dados de exemplo para o comprovante
  final Map<String, String> dadosDaColeta = {
    'produtor': 'João da Silva',
    'data': '12/10/2025',
    'quantidade': '150',
    'laticinio': 'Laticínios Toledo',
  };

  void _gerarPdf() async {
    setState(() => _isLoading = true);
    try {
      // 2. Usamos a instância para chamar o método que gera o PDF
      await _pdfService.gerarComprovante(
        produtor: dadosDaColeta['produtor']!,
        data: dadosDaColeta['data']!,
        quantidade: dadosDaColeta['quantidade']!,
        laticinio: dadosDaColeta['laticinio']!,
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao gerar PDF: $e')),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Comprovante para o Produtor'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Resumo da Coleta',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    _buildInfoRow('Produtor:', dadosDaColeta['produtor']!),
                    _buildInfoRow('Data:', dadosDaColeta['data']!),
                    _buildInfoRow(
                        'Quantidade:', '${dadosDaColeta['quantidade']} L'),
                    _buildInfoRow('Laticínio:', dadosDaColeta['laticinio']!),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),
            // 3. O botão que o usuário aperta chama a função _gerarPdf
            ElevatedButton.icon(
              onPressed: _isLoading ? null : _gerarPdf,
              icon: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.picture_as_pdf),
              label: const Text('Exportar em PDF'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
                textStyle: const TextStyle(fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text(value),
        ],
      ),
    );
  }
}
