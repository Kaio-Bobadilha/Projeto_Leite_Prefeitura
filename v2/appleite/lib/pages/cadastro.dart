import 'package:flutter/material.dart';
import '../services/api_service.dart';

enum PessoaTipo { fisica, juridica }

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _cadProCtrl = TextEditingController();

  PessoaTipo _pessoa = PessoaTipo.fisica;
  String? _tipoUsuario;

  // Controllers
  final _cpfCnpjCtrl = TextEditingController();
  final _ieCtrl = TextEditingController();
  final _dtNascCtrl = TextEditingController();
  final _imCtrl = TextEditingController();
  final _razaoCtrl = TextEditingController();
  final _fantasiaCtrl = TextEditingController();
  final _logradouroCtrl = TextEditingController();
  final _numeroCtrl = TextEditingController();
  final _bairroCtrl = TextEditingController();
  final _municipioCtrl = TextEditingController();
  String? _uf;
  final _cepCtrl = TextEditingController();
  final _paisCtrl = TextEditingController(text: "Brasil");

  @override
  void dispose() {
    _cpfCnpjCtrl.dispose();
    _ieCtrl.dispose();
    _dtNascCtrl.dispose();
    _imCtrl.dispose();
    _razaoCtrl.dispose();
    _fantasiaCtrl.dispose();
    _logradouroCtrl.dispose();
    _numeroCtrl.dispose();
    _bairroCtrl.dispose();
    _municipioCtrl.dispose();
    _cepCtrl.dispose();
    _paisCtrl.dispose();
    _cadProCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(now.year - 18, now.month, now.day),
      firstDate: DateTime(1900, 1, 1),
      lastDate: now,
      locale: const Locale('pt', 'BR'),
    );
    if (picked != null) {
      _dtNascCtrl.text =
          "${picked.day.toString().padLeft(2, '0')}/"
          "${picked.month.toString().padLeft(2, '0')}/${picked.year}";
    }
  }

  void _submit() async {
    if (_formKey.currentState!.validate()) {
      final dados = {
        "pessoa": _pessoa.name,
        "tipoUsuario": _tipoUsuario,
        "cpfCnpj": _cpfCnpjCtrl.text.trim(),
        "ie": _ieCtrl.text.trim(),
        "dataNascimento": _pessoa == PessoaTipo.fisica
            ? _dtNascCtrl.text
            : null,
        "inscricaoMunicipal": _imCtrl.text.trim(),
        "cadPro": _cadProCtrl.text.trim(),
        "razaoSocial": _razaoCtrl.text.trim(),
        "nomeFantasia": _fantasiaCtrl.text.trim(),
        "endereco": {
          "logradouro": _logradouroCtrl.text.trim(),
          "numero": _numeroCtrl.text.trim(),
          "bairro": _bairroCtrl.text.trim(),
          "municipio": _municipioCtrl.text.trim(),
          "uf": _uf,
          "cep": _cepCtrl.text.trim(),
          "pais": _paisCtrl.text.trim(),
        },
      };

      try {
        // Mostrar loading
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => const Center(
            child: CircularProgressIndicator(),
          ),
        );

        final apiService = ApiService();
        final response = await apiService.cadastro(dados);

        // Fechar loading
        if (mounted) Navigator.of(context).pop();

        if (response.success) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Cadastro realizado com sucesso!'),
                backgroundColor: Colors.green,
              ),
            );
            Navigator.of(context).pop(); // Voltar para tela anterior
          }
        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(response.error ?? 'Erro no cadastro'),
                backgroundColor: Colors.red,
              ),
            );
          }
        }
      } catch (e) {
        // Fechar loading se ainda estiver aberto
        if (mounted) Navigator.of(context).pop();
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Erro de conexão: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  String? _validaObrigatorio(String? v, {String label = 'Campo'}) {
    if (v == null || v.trim().isEmpty) return '$label obrigatório';
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final ufs = const [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ];
    final tiposUsuario = const ['Admin', 'Laticínio', 'Coletor', 'Produtor'];

    return Scaffold(
      appBar: AppBar(title: const Text('Cadastro de Usuário')),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Tipo de pessoa
                Row(
                  children: [
                    Expanded(
                      child: RadioListTile<PessoaTipo>(
                        title: const Text("Física"),
                        value: PessoaTipo.fisica,
                        groupValue: _pessoa,
                        onChanged: (v) => setState(() => _pessoa = v!),
                      ),
                    ),
                    Expanded(
                      child: RadioListTile<PessoaTipo>(
                        title: const Text("Jurídica"),
                        value: PessoaTipo.juridica,
                        groupValue: _pessoa,
                        onChanged: (v) => setState(() => _pessoa = v!),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Tipo de usuário
                DropdownButtonFormField<String>(
                  value: _tipoUsuario,
                  items: tiposUsuario
                      .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                      .toList(),
                  decoration: const InputDecoration(
                    labelText: 'Tipo de Usuário',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      v == null ? 'Selecione o tipo de usuário' : null,
                  onChanged: (v) => setState(() => _tipoUsuario = v),
                ),
                const SizedBox(height: 16),

                // CPF/CNPJ
                TextFormField(
                  controller: _cpfCnpjCtrl,
                  decoration: InputDecoration(
                    labelText: _pessoa == PessoaTipo.fisica ? 'CPF' : 'CNPJ',
                    border: const OutlineInputBorder(),
                  ),
                  validator: (v) => _validaObrigatorio(
                    v,
                    label: _pessoa == PessoaTipo.fisica ? 'CPF' : 'CNPJ',
                  ),
                ),
                const SizedBox(height: 16),

                // IE
                TextFormField(
                  controller: _ieCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Inscrição Estadual (IE)',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) => _validaObrigatorio(v, label: 'IE'),
                ),
                const SizedBox(height: 16),

                // Data Nascimento só se Física
                if (_pessoa == PessoaTipo.fisica) ...[
                  TextFormField(
                    controller: _dtNascCtrl,
                    readOnly: true,
                    decoration: const InputDecoration(
                      labelText: 'Data de Nascimento',
                      border: OutlineInputBorder(),
                    ),
                    validator: (v) =>
                        _validaObrigatorio(v, label: 'Data de Nascimento'),
                    onTap: _pickDate,
                  ),
                  const SizedBox(height: 16),
                ],

                // IM
                TextFormField(
                  controller: _imCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Inscrição Municipal',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      _validaObrigatorio(v, label: 'Inscrição Municipal'),
                ),
                const SizedBox(height: 16),

                // Razão Social
                TextFormField(
                  controller: _razaoCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Razão Social',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      _validaObrigatorio(v, label: 'Razão Social'),
                ),
                const SizedBox(height: 16),

                // Nome Fantasia
                TextFormField(
                  controller: _fantasiaCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Nome Fantasia',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      _validaObrigatorio(v, label: 'Nome Fantasia'),
                ),
                const SizedBox(height: 16),

                // Endereço
                TextFormField(
                  controller: _logradouroCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Logradouro',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _numeroCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Número',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _bairroCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Bairro',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _municipioCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Município',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _uf,
                  items: ufs
                      .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                      .toList(),
                  decoration: const InputDecoration(
                    labelText: 'UF',
                    border: OutlineInputBorder(),
                  ),
                  onChanged: (v) => setState(() => _uf = v),
                  validator: (v) => v == null ? 'Selecione a UF' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _cepCtrl,
                  decoration: const InputDecoration(
                    labelText: 'CEP',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _paisCtrl,
                  decoration: const InputDecoration(
                    labelText: 'País',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 24),
                TextFormField(
                  controller: _cadProCtrl,
                  decoration: const InputDecoration(
                    labelText: 'CAD PRO',
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) => _validaObrigatorio(v, label: 'CAD PRO'),
                ),
                const SizedBox(height: 16),

                ElevatedButton(
                  onPressed: _submit,
                  child: const Text("Enviar Cadastro"),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
