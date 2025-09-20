import 'package:flutter/material.dart';

enum PessoaTipo { fisica, juridica }

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();

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

  void _submit() {
    if (_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cadastro enviado com sucesso!')),
      );
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
