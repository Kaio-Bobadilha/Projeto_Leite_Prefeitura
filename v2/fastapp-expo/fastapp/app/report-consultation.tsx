import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Calendar, 
  Search, 
  Filter,
  FileText,
  Users,
  Package,
  Thermometer,
  ChevronRight
} from 'lucide-react-native';

// Mock data for initial collection reports
const mockReports = [
  {
    id: 'REP-001',
    title: 'Coleta Inicial - Tanque TN-2024-A',
    date: '15/04/2024',
    time: '08:30',
    producer: 'Fazenda Santa Clara',
    producerCode: 'PC-7890',
    tankNumber: 'TN-2024-A',
    temperature: '4.2°C',
    alizarolTest: 'Negativo',
    responsiblePerson: 'Carlos Silva',
    status: 'completed'
  },
  {
    id: 'REP-002',
    title: 'Coleta Inicial - Tanque TN-2024-B',
    date: '14/04/2024',
    time: '09:15',
    producer: 'Cooperativa dos Produtores',
    producerCode: 'PC-5678',
    tankNumber: 'TN-2024-B',
    temperature: '3.8°C',
    alizarolTest: 'Negativo',
    responsiblePerson: 'Ana Oliveira',
    status: 'completed'
  },
  {
    id: 'REP-003',
    title: 'Coleta Inicial - Tanque TN-2024-C',
    date: '13/04/2024',
    time: '07:45',
    producer: 'Fazenda São João',
    producerCode: 'PC-1234',
    tankNumber: 'TN-2024-C',
    temperature: '4.5°C',
    alizarolTest: 'Positivo',
    responsiblePerson: 'Roberto Santos',
    status: 'pending'
  },
  {
    id: 'REP-004',
    title: 'Coleta Inicial - Tanque TN-2024-D',
    date: '12/04/2024',
    time: '08:20',
    producer: 'Laticínio Vale do Leite',
    producerCode: 'PC-4567',
    tankNumber: 'TN-2024-D',
    temperature: '3.9°C',
    alizarolTest: 'Negativo',
    responsiblePerson: 'Mariana Costa',
    status: 'completed'
  },
  {
    id: 'REP-005',
    title: 'Coleta Inicial - Tanque TN-2024-E',
    date: '11/04/2024',
    time: '09:00',
    producer: 'Indústria Láctea Premium',
    producerCode: 'PC-8901',
    tankNumber: 'TN-2024-E',
    temperature: '4.1°C',
    alizarolTest: 'Negativo',
    responsiblePerson: 'Pedro Almeida',
    status: 'completed'
  }
];

export default function ReportConsultationScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter reports based on search and filter criteria
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'completed') return matchesSearch && report.status === 'completed';
    if (activeFilter === 'pending') return matchesSearch && report.status === 'pending';
    
    return matchesSearch;
  });

  const filterOptions = [
    { id: 'all', name: 'Todos' },
    { id: 'completed', name: 'Concluídos' },
    { id: 'pending', name: 'Pendentes' }
  ];

  const reportCategories = [
    { id: 'all', name: 'Todos', icon: FileText },
    { id: 'producers', name: 'Produtores', icon: Users },
    { id: 'collectors', name: 'Coletores', icon: Package },
    { id: 'dairies', name: 'Laticínios', icon: Thermometer }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-3 p-2 rounded-full bg-blue-500"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Consulta de Relatórios</Text>
        </View>
        <Text className="text-blue-100 text-sm ml-12">Relatórios de Coleta Inicial</Text>
      </View>

      {/* Search and Filters */}
      <View className="px-4 mt-4">
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-3 shadow-sm">
          <Search color="#9CA3AF" size={20} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por produtor, ID ou tanque..."
            className="flex-1 ml-2 text-gray-700"
          />
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          <View className="flex-row gap-2">
            {reportCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-2 rounded-xl flex-row items-center ${
                    activeFilter === category.id 
                      ? 'bg-blue-600' 
                      : 'bg-white border border-gray-200'
                  }`}
                  onPress={() => setActiveFilter(category.id)}
                >
                  <IconComponent 
                    size={16} 
                    color={activeFilter === category.id ? '#fff' : '#3498db'} 
                  />
                  <Text 
                    className={`ml-2 text-sm font-medium ${
                      activeFilter === category.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Stats Cards */}
      <View className="mx-4 mt-2">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white rounded-xl p-3 shadow-sm">
            <Text className="text-gray-500 text-xs">Total</Text>
            <Text className="text-xl font-bold text-gray-800 mt-1">{mockReports.length}</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3 shadow-sm">
            <Text className="text-gray-500 text-xs">Concluídos</Text>
            <Text className="text-xl font-bold text-green-500 mt-1">
              {mockReports.filter(r => r.status === 'completed').length}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3 shadow-sm">
            <Text className="text-gray-500 text-xs">Pendentes</Text>
            <Text className="text-xl font-bold text-orange-500 mt-1">
              {mockReports.filter(r => r.status === 'pending').length}
            </Text>
          </View>
        </View>
      </View>

      {/* Reports List */}
      <View className="flex-1 mt-6 mx-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Relatórios Encontrados ({filteredReports.length})
          </Text>
        </View>

        <ScrollView className="flex-1">
          {filteredReports.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center justify-center">
              <FileText size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-center">
                Nenhum relatório encontrado com os critérios selecionados
              </Text>
            </View>
          ) : (
            filteredReports.map((report) => (
              <TouchableOpacity 
                key={report.id}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
                onPress={() => router.push(`/report-detail?id=${report.id}`)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-bold text-gray-800">{report.title}</Text>
                      <Text className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        report.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {report.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </Text>
                    </View>
                    
                    <Text className="text-gray-600 mt-2 text-sm">{report.producer}</Text>
                    
                    <View className="flex-row mt-3">
                      <Calendar size={16} color="#9CA3AF" />
                      <Text className="text-gray-500 text-sm ml-2">{report.date} • {report.time}</Text>
                    </View>
                    
                    <View className="flex-row mt-2">
                      <Text className="text-gray-500 text-sm">
                        Tanque: <Text className="font-medium">{report.tankNumber}</Text>
                      </Text>
                      <Text className="text-gray-500 text-sm ml-4">
                        Temp: <Text className="font-medium">{report.temperature}</Text>
                      </Text>
                    </View>
                  </View>
                  
                  <View className="items-end">
                    <ChevronRight size={20} color="#9CA3AF" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}