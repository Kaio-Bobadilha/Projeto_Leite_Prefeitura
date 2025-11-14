import 'package:flutter/material.dart';

void main() {
  runApp(const MaterialApp(home: Produtores()));
}

class ProdutorApi {
  final String razaoSocial;
  final String endereco;
  final String cpfCnpj;

  ProdutorApi({
    required this.razaoSocial,
    required this.endereco,
    required this.cpfCnpj,
  });

  Produtor toProdutor() {
    return Produtor(
      nome: razaoSocial,
      localizacao: endereco,
      cnpj: cpfCnpj,
    );
  }
}

class Produtor {
  final String nome;
  final String localizacao;
  final String cnpj;

  Produtor({required this.nome, required this.localizacao, required this.cnpj});
}

class Produtores extends StatefulWidget {
  const Produtores({super.key});

  @override
  State<Produtores> createState() => _Produtores();
}

class _Produtores extends State<Produtores> {
  final List<ProdutorApi> _produtoresApiMock = [
    ProdutorApi(
        razaoSocial: 'Rodolfo (Fazenda Boa Vista)',
        endereco: 'Dist boa vista',
        cpfCnpj: '00.623.904/0'),
    ProdutorApi(
        razaoSocial: 'Maria dos Santos (Sítio Central)',
        endereco: 'Centro',
        cpfCnpj: '12.345.678/0001-99'),
    ProdutorApi(
        razaoSocial: 'Agro Ind. LTDA',
        endereco: 'Zona Rural Sul',
        cpfCnpj: '99.999.999/0001-00'),
  ];

  late Future<List<Produtor>> _futureProdutores;
  
  List<Produtor> _filteredProdutores = [];

  List<Produtor> _masterProdutores = [];

  bool _showSearchField = false;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _futureProdutores = _fetchProdutores();
    _searchController.addListener(_filterProdutores);
  }

  Future<List<Produtor>> _fetchProdutores() async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    return _produtoresApiMock.map((apiItem) => apiItem.toProdutor()).toList();
  }

  void _filterProdutores() {
    final query = _searchController.text.toLowerCase();
    
    setState(() {
      _filteredProdutores = _masterProdutores.where((produtor) {
        return produtor.nome.toLowerCase().contains(query) ||
            produtor.localizacao.toLowerCase().contains(query) ||
            produtor.cnpj.toLowerCase().contains(query);
      }).toList();
    });
  }

  void _onSearchPressed() {
    setState(() {
      _showSearchField = !_showSearchField;
      if (!_showSearchField) {
        _searchController.clear();
        _filteredProdutores = _masterProdutores; 
      }
    });
  }

  void _showProdutorDetails(Produtor produtor) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ProdutorDetailsScreen(produtor: produtor),
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Listagem de produtores'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.search),
                      color: Colors.blue,
                      onPressed: _onSearchPressed,
                      tooltip: 'Buscar',
                    ),
                    if (_showSearchField)
                      SizedBox(
                        width: MediaQuery.of(context).size.width * 0.5,
                        child: TextField(
                          controller: _searchController,
                          decoration: const InputDecoration(
                            hintText: 'Buscar por nome, local ou CNPJ...',
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            
            Card(
              color: Colors.blue.shade50,
              margin: const EdgeInsets.symmetric(vertical: 8.0),
              child: const Padding(
                padding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 16.0),
                child: Row(
                  children: [
                    Expanded(
                      flex: 4,
                      child: Text('Produtor', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    Expanded(
                      flex: 3,
                      child: Text('Localização', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    Expanded(
                      flex: 3,
                      child: Text('CNPJ', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    Expanded(
                      flex: 1,
                      child: Center(child: Text('+', style: TextStyle(fontWeight: FontWeight.bold))),
                    ),
                  ],
                ),
              ),
            ),
            
            Expanded(
              child: FutureBuilder<List<Produtor>>(
                future: _futureProdutores,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  if (snapshot.hasError) {
                    return Center(child: Text('Erro ao carregar dados: ${snapshot.error}'));
                  }
                  
                  if (snapshot.hasData) {
                    final List<Produtor> allProdutores = snapshot.data ?? [];
                    
                    if (_masterProdutores.isEmpty) {
                      _masterProdutores = allProdutores;
                      _filteredProdutores = _masterProdutores; 
                    }

                    if (_filteredProdutores.isEmpty) {
                      return const Center(child: Text('Nenhum produtor encontrado'));
                    }

                    return ListView.builder(
                      itemCount: _filteredProdutores.length,
                      itemBuilder: (context, index) {
                        final produtor = _filteredProdutores[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8.0),
                          elevation: 1,
                          child: InkWell(
                            onTap: () => _showProdutorDetails(produtor),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 16.0),
                              child: Row(
                                children: [
                                  Expanded(
                                    flex: 4, 
                                    child: Text(
                                      produtor.nome, 
                                      style: const TextStyle(fontWeight: FontWeight.w600),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  Expanded(
                                    flex: 3, 
                                    child: Text(produtor.localizacao, style: TextStyle(color: Colors.grey.shade700)),
                                  ),
                                  Expanded(
                                    flex: 3,
                                    child: Text(produtor.cnpj, style: TextStyle(color: Colors.grey.shade700)),
                                  ),
                                  Expanded(
                                    flex: 1, 
                                    child: Center(
                                      child: Icon(Icons.chevron_right, size: 20, color: Colors.blue),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    );
                  }
                  
                  return const SizedBox.shrink(); 
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProdutorDetailsScreen extends StatelessWidget {
  final Produtor produtor;

  const ProdutorDetailsScreen({super.key, required this.produtor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalhes do Produtor'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: CircleAvatar(
                radius: 40,
                backgroundColor: Colors.blue.shade100,
                child: Icon(Icons.person, size: 40, color: Colors.blue),
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: Text(
                produtor.nome,
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ),
            const Divider(height: 30, thickness: 1),
            
            _buildDetailRow(
              icon: Icons.badge,
              label: 'CNPJ/CPF',
              value: produtor.cnpj,
            ),
            _buildDetailRow(
              icon: Icons.location_on,
              label: 'Localização',
              value: produtor.localizacao,
            ),
            _buildDetailRow(
              icon: Icons.info,
              label: 'Outras Info',
              value: 'Campo simulado (Exemplo de Razão Social)', 
            ),
            const Divider(height: 30, thickness: 1),

            const Text(
              'Status de Cadastro', 
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue),
            ),
            const SizedBox(height: 8),
            
            Row(
              children: [
                Icon(Icons.check_circle, color: Colors.green, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Produtor ativo e com dados verificados.',
                  style: TextStyle(fontSize: 16, color: Colors.grey.shade600),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildDetailRow({required IconData icon, required String label, required String value}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.blue, size: 20),
          const SizedBox(width: 10),
          Expanded(
            flex: 3,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),
          Expanded(
            flex: 5,
            child: Text(
              value,
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }
}