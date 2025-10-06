import 'package:projeto_leite/BACK/Models/LaticiniosVinculo.dart';

class CadastroMotorista extends Laticiniosvinculo {
  final String codigoMotorista;
  final String nome;
  final String cpf;
  final String cnh;
  final String telefone;
  final String endereco;
  final DateTime validarCnh;
  final bool ativo;

  CadastroMotorista({
    required super.laticiniosCnpj,
    required super.laticiniosNome,
    required this.codigoMotorista,
    required this.nome,
    required this.cpf,
    required this.cnh,
    required this.validarCnh,
    required this.telefone,
    this.endereco = '',
    this.ativo = true,
  });

  bool get cnhValida {
    return validarCnh.isAfter(DateTime.now());
  }

  bool get dadosCompletos {
    return nome.isNotEmpty &&
        cpf.isNotEmpty &&
        cnh.isNotEmpty &&
        telefone.isNotEmpty;
  }

  @override
  String toString() {
    return 'CadastroMotorista';
  }
}
