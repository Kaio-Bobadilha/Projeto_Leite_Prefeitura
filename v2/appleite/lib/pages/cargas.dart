import 'package:flutter/material.dart';

class RegistroColeta {
  final int id;
  final String nomeProdutor;
  final String nomeMotorista;
  final String placaVeiculo;
  final DateTime dataColeta;
  final double temperatura;
  final String alizarol;
  final String status;

  RegistroColeta({
    required this.id,
    required this.nomeProdutor,
    required this.nomeMotorista,
    required this.placaVeiculo,
    required this.dataColeta,
    required this.temperatura,
    required this.alizarol,
    required this.status,
  });
}

final List<RegistroColeta> coletasDeLeiteFicticias = [
  RegistroColeta(id: 1, nomeProdutor: "Fazenda Sol Nascente", nomeMotorista: "João Silva", placaVeiculo: "ABC-1234", dataColeta: DateTime(2025, 11, 10, 8, 30), temperatura: 3.5, alizarol: "Negativo (6.8°GL)", status: "Analisado"),
  RegistroColeta(id: 2, nomeProdutor: "Sítio Primavera", nomeMotorista: "Maria Souza", placaVeiculo: "XYZ-5678", dataColeta: DateTime(2025, 11, 11, 10, 00), temperatura: 4.1, alizarol: "Positivo (7.5°GL)", status: "Rejeitado"),
  RegistroColeta(id: 3, nomeProdutor: "Chácara Boa Vista", nomeMotorista: "Pedro Almeida", placaVeiculo: "DEF-9012", dataColeta: DateTime(2025, 11, 12, 11, 45), temperatura: 3.8, alizarol: "Negativo (7.0°GL)", status: "Coletado"),
  RegistroColeta(id: 4, nomeProdutor: "Fazenda Estrela", nomeMotorista: "Ana Oliveira", placaVeiculo: "GHI-2468", dataColeta: DateTime(2025, 11, 12, 14, 00), temperatura: 3.2, alizarol: "Negativo (6.9°GL)", status: "Coletado"),
];

class CargasScreen extends StatefulWidget {
  const CargasScreen({super.key});
  @override
  State<CargasScreen> createState() => _CargasScreenState();
}

class _CargasScreenState extends State<CargasScreen> {
  DateTime? _dataFiltro;

  Color _getStatusColor(String status) {
    final lowerStatus = status.toLowerCase();
    if (lowerStatus == "rejeitado") {
      return Colors.red.shade700;
    } else if (lowerStatus == "analisado") {
      return Colors.green.shade700;
    } 
    return Colors.blue.shade700; 
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _dataFiltro ?? DateTime.now(),
      firstDate: DateTime(2023),
      lastDate: DateTime(2026),
      helpText: 'Selecione a Data da Coleta',
      cancelText: 'Limpar Filtro',
      confirmText: 'Filtrar',
    );
    if (picked != null) {
      setState(() {
        _dataFiltro = picked;
      });
    } else if (picked == null && _dataFiltro != null) {
      setState(() {
        _dataFiltro = null;
      });
    }
  }

  List<RegistroColeta> _getColetasFiltradas() {
    if (_dataFiltro == null) {
      return coletasDeLeiteFicticias;
    }
    
    return coletasDeLeiteFicticias.where((coleta) {
      return coleta.dataColeta.year == _dataFiltro!.year &&
             coleta.dataColeta.month == _dataFiltro!.month &&
             coleta.dataColeta.day == _dataFiltro!.day;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final coletasFiltradas = _getColetasFiltradas();
    final String dataFormatada = _dataFiltro == null 
        ? 'Todas as Datas' 
        : '${_dataFiltro!.day}/${_dataFiltro!.month}/${_dataFiltro!.year}'; // Idealmente use Intl.DateFormat('dd/MM/yyyy').format(_dataFiltro!)

    return Scaffold(
      appBar: AppBar(
        title: const Text('🥛 Listagem de Cargas'),
        backgroundColor: Colors.teal.shade700,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: InkWell(
              onTap: () => _selectDate(context),
              child: InputDecorator(
                decoration: InputDecoration(
                  labelText: 'Filtrar por Data',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.calendar_today, color: Colors.teal),
                  suffixIcon: _dataFiltro != null
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: Colors.grey),
                          onPressed: () {
                            setState(() {
                              _dataFiltro = null;
                            });
                          },
                        )
                      : const Icon(Icons.arrow_drop_down, color: Colors.grey),
                ),
                child: Text(
                  dataFormatada,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
          
          Expanded(
            child: coletasFiltradas.isEmpty
                ? Center(child: Text(_dataFiltro == null ? 'Nenhuma coleta registrada.' : 'Nenhuma coleta encontrada para $dataFormatada.'))
                : ListView.builder(
                    itemCount: coletasFiltradas.length,
                    itemBuilder: (context, index) {
                      final coleta = coletasFiltradas[index];
                      
                      return Card(
                        margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        elevation: 3,
                        child: ListTile(
                          leading: Icon(
                            Icons.local_shipping,
                            color: _getStatusColor(coleta.status),
                            size: 40,
                          ),
                          title: Text(
                            coleta.nomeProdutor,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Motorista: ${coleta.nomeMotorista} | Placa: ${coleta.placaVeiculo}'),
                              Text('Alizarol: ${coleta.alizarol} | Temp: ${coleta.temperatura.toStringAsFixed(1)}°C'),
                              const SizedBox(height: 4),
                              Text(
                                'Status: ${coleta.status}',
                                style: TextStyle(
                                  color: _getStatusColor(coleta.status),
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => DetalheColetaScreen(coleta: coleta),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
class DetalheColetaScreen extends StatelessWidget {
  final RegistroColeta coleta;

  const DetalheColetaScreen({super.key, required this.coleta});

  Color _getStatusColor(String status) {
    final lowerStatus = status.toLowerCase();
    if (lowerStatus == "rejeitado") {
      return Colors.red.shade700;
    } else if (lowerStatus == "analisado") {
      return Colors.green.shade700;
    }
    return Colors.blue.shade700; 
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor(coleta.status);

    return Scaffold(
      appBar: AppBar(
        title: Text('Detalhes da Coleta #${coleta.id}'),
        backgroundColor: Colors.teal.shade700,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              elevation: 4,
              color: statusColor.withOpacity(0.1),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: statusColor, width: 2)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    Icon(
                      coleta.status.toLowerCase() == "rejeitado" ? Icons.cancel : Icons.check_circle,
                      color: statusColor,
                      size: 30,
                    ),
                    const SizedBox(width: 15),
                    Text(
                      'STATUS: ${coleta.status.toUpperCase()}',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: statusColor,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            _buildDetailSection('Informações da Viagem', [
              _buildDetailRow(Icons.person, 'Produtor', coleta.nomeProdutor),
              _buildDetailRow(Icons.badge, 'Motorista', coleta.nomeMotorista),
              _buildDetailRow(Icons.directions_car, 'Placa', coleta.placaVeiculo),
              _buildDetailRow(Icons.calendar_today, 'Data/Hora', 
                '${coleta.dataColeta.day}/${coleta.dataColeta.month}/${coleta.dataColeta.year} às ${coleta.dataColeta.hour.toString().padLeft(2, '0')}:${coleta.dataColeta.minute.toString().padLeft(2, '0')}'),
            ]),
            
            const SizedBox(height: 20),

            _buildDetailSection('Dados de Qualidade', [
              _buildDetailRow(Icons.thermostat, 'Temperatura', '${coleta.temperatura.toStringAsFixed(1)}°C'),
              _buildDetailRow(Icons.science, 'Teste Alizarol', coleta.alizarol),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.teal.shade800),
        ),
        const Divider(),
        ...children,
      ],
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Colors.grey.shade600),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Colors.grey),
                ),
                Text(
                  value,
                  style: const TextStyle(fontSize: 16, color: Colors.black87),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}