/* Criação da classe de Cadastro dos Laticinios */

class CadastroLaticinios {
  final String razaoSocial;
  final String cnpj;
  final String ie;
  final String regimeTributario;
  final String endereco;
  final String telefone;

  CadastroLaticinios({
    required this.cnpj,
    required this.telefone,
    required this.razaoSocial,
    required this.endereco,
    this.ie = '',
    this.regimeTributario = '',
  });

  @override
  String toString() {
    return 'CadastroLaticinios{razaoSocial: $razaoSocial, cnpj: $cnpj, ie: $ie, endereco: $endereco, regimeTributario: $regimeTributario, telefone: $endereco }';
  }

  bool get cnpjValido {
    return cnpj.isNotEmpty && cnpj.length == 14;
  }

  bool get telefoneValido {
    return telefone.isNotEmpty && telefone.length >= 10;
  }

  bool get dadosCompletos {
    return razaoSocial.isNotEmpty &&
        cnpj.isNotEmpty &&
        endereco.isNotEmpty &&
        telefone.isNotEmpty;
  }
}
