/* Criação da classe Registro_Coleta dos Produtores de Leite */

class RegistroColeta {
  final int id;
  final String produtor;
  final String motorista;
  final String placaVeiculo;
  final DateTime data;
  final double temperatura;
  final String alizarol;
  final String status; // Ex: "Coletado", "Analisado", "Rejeitado"
  // Futuramente podermos adicionar mais campos. O que ACHAM?

  RegistroColeta({
    required this.id,
    required this.produtor,
    required this.motorista,
    required this.placaVeiculo,
    required this.data,
    required this.temperatura,
    required this.alizarol,
    this.status = "Coletado",
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'produtor': produtor,
      'motorista': motorista,
      'placaVeiculo': placaVeiculo,
      'data': data.toIso8601String(),
      'temperatura': temperatura,
      'alizarol': alizarol,
      'status': status,
    };
  }
}
