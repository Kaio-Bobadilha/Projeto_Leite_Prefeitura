import 'package:flutter/material.dart';

void main() {
  runApp(const MaterialApp(home: Produtores()));
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
  bool _showSearchField = false;
  final TextEditingController _searchController = TextEditingController();
  final List<Produtor> produtores = [
    Produtor(nome: 'Rodolfo', localizacao: 'Dist boa vista', cnpj: '00.623.904/0'),
    Produtor(nome: 'Maria', localizacao: 'Centro', cnpj: '12.345.678/0001-99'),
  ];
  List<Produtor> _filteredProdutores = [];

  @override
  void initState() {
    super.initState();
    _filteredProdutores = produtores;
    _searchController.addListener(_filterProdutores);
  }

  void _filterProdutores() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredProdutores = produtores.where((produtor) {
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
        _filteredProdutores = produtores;
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
                  mainAxisAlignment: MainAxisAlignment.end, // Botão de busca à direita
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
                            hintText: 'Name...',
                            border: OutlineInputBorder(),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            Card(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      flex: 3,
                      child: Text(
                        'Nome',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    Expanded(
                      flex: 3, 
                      child: Text(
                        'Localização',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    Expanded(
                      flex: 3, 
                      child: Text(
                        'CNPJ',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    Expanded(
                      flex: 2, 
                      child: Text(
                        'Informações',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              child: _filteredProdutores.isEmpty
                  ? const Center(child: Text('Nenhum produtor encontrado'))
                  : ListView.builder(
                      itemCount: _filteredProdutores.length,
                      itemBuilder: (context, index) {
                        final produtor = _filteredProdutores[index];
                        return Card(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  flex: 3, 
                                  child: Text(produtor.nome),
                                ),
                                Expanded(
                                  flex: 3, 
                                  child: Text(produtor.localizacao),
                                ),
                                Expanded(
                                  flex: 3,
                                  child: Text(produtor.cnpj),
                                ),
                                Expanded(
                                  flex: 2, 
                                  child: IconButton(
                                    icon: const Icon(Icons.info_outline),
                                    tooltip: 'Mostrar detalhes',
                                    onPressed: () => _showProdutorDetails(produtor),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
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
        title: Text(produtor.nome),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Nome: ${produtor.nome}', style: const TextStyle(fontSize: 18)),
            Text('Localização: ${produtor.localizacao}', style: const TextStyle(fontSize: 18)),
            Text('CNPJ: ${produtor.cnpj}', style: const TextStyle(fontSize: 18)),
          ],
        ),
      ),
    );
  }
}