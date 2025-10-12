import 'dart:io';
import 'package:flutter/foundation.dart'; // Importe para usar o 'kIsWeb'
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:open_file/open_file.dart';
import 'dart:html' as html; // Deixe este import aqui

class PdfService {
  Future<void> gerarComprovante({
    required String produtor,
    required String data,
    required String quantidade,
    required String laticinio,
  }) async {
    final pdf = pw.Document();

    // Adiciona uma página ao PDF
    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              pw.SizedBox(height: 20),
              _buildTitle(),
              pw.SizedBox(height: 30),
              _buildDetails(produtor, data, quantidade, laticinio),
              pw.Spacer(),
              _buildFooter(),
            ],
          );
        },
      ),
    );

    // Salva o arquivo e abre
    await _saveAndOpenFile(pdf);
  }

  pw.Widget _buildHeader() {
    return pw.Container(
      alignment: pw.Alignment.center,
      child: pw.Text(
        'Comprovante de Coleta de Leite',
        style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold),
      ),
    );
  }

  pw.Widget _buildTitle() {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Text(
          'Detalhes da Coleta',
          style: pw.TextStyle(
            fontSize: 20,
            fontWeight: pw.FontWeight.bold,
            color: PdfColors.green800,
          ),
        ),
        pw.Divider(),
      ],
    );
  }

  pw.Widget _buildDetails(
    String produtor,
    String data,
    String quantidade,
    String laticinio,
  ) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        _buildDetailRow('Produtor:', produtor),
        _buildDetailRow('Data da Coleta:', data),
        _buildDetailRow('Quantidade:', '$quantidade Litros'),
        _buildDetailRow('Laticínio de Destino:', laticinio),
      ],
    );
  }

  pw.Widget _buildDetailRow(String label, String value) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 4),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(label, style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
          pw.Text(value),
        ],
      ),
    );
  }

  pw.Widget _buildFooter() {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.center,
      children: [
        pw.Divider(),
        pw.SizedBox(height: 10),
        pw.Text(
          'Prefeitura de Toledo - Programa de Apoio ao Produtor de Leite',
          style: const pw.TextStyle(color: PdfColors.grey),
        ),
      ],
    );
  }

  // ================== INÍCIO DA MODIFICAÇÃO ==================
  Future<void> _saveAndOpenFile(pw.Document pdf) async {
    try {
      final bytes = await pdf.save();

      // Verifica se a plataforma é Web
      if (kIsWeb) {
        // Lógica para Web (faz o download)
        final blob = html.Blob([bytes], 'application/pdf');
        final url = html.Url.createObjectUrlFromBlob(blob);
        final anchor = html.AnchorElement(href: url)
          ..setAttribute("download", "comprovante.pdf")
          ..click();
        html.Url.revokeObjectUrl(url);
      } else {
        // Lógica para Mobile (salva e abre o arquivo)
        final directory = await getApplicationDocumentsDirectory();
        final path = '${directory.path}/comprovante.pdf';
        final file = File(path);
        await file.writeAsBytes(bytes);

        // Abre o arquivo PDF
        await OpenFile.open(path);
      }
    } catch (e) {
      print('Erro ao salvar ou abrir o PDF: $e');
    }
  }
  // =================== FIM DA MODIFICAÇÃO ===================
}
