/* Criação da classe de cadastro de Produtores de Leite */

import 'package:projeto_leite/BACK/Models/LaticiniosVinculo.dart';

class CadastroProdutor extends Laticiniosvinculo {
  final String cadPro;
  final String nome;
  final String cpf;
  final String local;
  final String ie;

  CadastroProdutor({
    required super.laticiniosNome,
    required super.laticiniosCnpj,
    required this.cadPro,
    required this.nome,
    required this.cpf,
    this.local = '',
    this.ie = '',
  });

  @override
  String toString() {
    return 'CadatroProdutor{cadPro: $cadPro, nome: $nome, cpf: $cpf, local: $local, ie: $ie}';
  }

  bool get cpfValido {
    return cpf.isNotEmpty && cpf.length == 11;
  }

  bool get dadosCompletos {
    return cadPro.isNotEmpty && nome.isNotEmpty && cpf.isNotEmpty;
  }
}
