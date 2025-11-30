import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  FileText, 
  Users, 
  Package, 
  Thermometer,
  FlaskConical,
  Syringe,
  FileCheck,
  CheckCircle,
  ArrowRight
} from 'lucide-react-native';

export default function PDFExportSelectionScreen() {
  const router = useRouter();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  // Report types that can be exported
  const reportTypes = [
    {
      id: 'initial-collection',
      title: 'Relatórios de Coleta Inicial',
      description: 'Dados de coleta inicial de leite',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'physical-chemical',
      title: 'Análises Físico-Químicas',
      description: 'Resultados das análises físico-químicas',
      icon: FlaskConical,
      color: 'bg-purple-500'
    },
    {
      id: 'antibiotic-control',
      title: 'Controle de Antibióticos',
      description: 'Verificação de resíduos de antibióticos',
      icon: Syringe,
      color: 'bg-red-500'
    },
    {
      id: 'pasteurization-control',
      title: 'Controle de Pasteurização',
      description: 'Registros de processo de pasteurização',
      icon: Thermometer,
      color: 'bg-orange-500'
    },
    {
      id: 'adulterant-summary',
      title: 'Resumo de Adulterantes',
      description: 'Detecção de substâncias adulterantes',
      icon: FileCheck,
      color: 'bg-green-500'
    }
  ];

  const toggleReportSelection = (id: string) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(selectedReports.filter(reportId => reportId !== id));
    } else {
      setSelectedReports([...selectedReports, id]);
    }
  };

  const handleExport = () => {
    if (selectedReports.length === 0) {
      Alert.alert(
        'Nenhum relatório selecionado',
        'Por favor, selecione pelo menos um tipo de relatório para exportar.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Exportar para PDF',
      `Deseja exportar os ${selectedReports.length} tipos de relatórios selecionados como PDF?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Exportar',
          onPress: () => {
            Alert.alert(
              'Exportação Concluída',
              `${selectedReports.length} relatórios foram exportados com sucesso!`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const goToReportConsultation = () => {
    router.push('/report-consultation');
  };

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
          <Text className="text-white text-xl font-bold">Exportar Relatórios</Text>
        </View>
        <Text className="text-blue-100 text-sm ml-12">Selecione os tipos de relatórios para exportar</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 mt-6 mx-4">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Selecione os Relatórios
        </Text>
        
        <ScrollView className="flex-1 mb-4">
          {reportTypes.map((report) => {
            const isSelected = selectedReports.includes(report.id);
            const IconComponent = report.icon;
            
            return (
              <TouchableOpacity
                key={report.id}
                className={`flex-row items-center bg-white rounded-xl p-4 mb-4 shadow-sm border ${
                  isSelected ? 'border-blue-500' : 'border-gray-100'
                }`}
                onPress={() => toggleReportSelection(report.id)}
              >
                <View className={`${report.color} p-3 rounded-lg`}>
                  <IconComponent color="white" size={24} />
                </View>
                
                <View className="flex-1 ml-4">
                  <Text className="font-bold text-gray-800">{report.title}</Text>
                  <Text className="text-gray-600 text-sm mt-1">{report.description}</Text>
                </View>
                
                {isSelected ? (
                  <CheckCircle color="#3498db" size={24} />
                ) : (
                  <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {/* Action Buttons */}
        <View className="mb-6">
          <TouchableOpacity 
            className={`flex-row items-center justify-center py-4 rounded-xl mb-4 ${
              selectedReports.length > 0 ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onPress={handleExport}
            disabled={selectedReports.length === 0}
          >
            <FileText color="white" size={20} />
            <Text className="text-white font-bold ml-2">
              Exportar {selectedReports.length} Relatório(s)
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center justify-center py-4 bg-white rounded-xl border border-gray-200"
            onPress={goToReportConsultation}
          >
            <Text className="text-blue-600 font-bold mr-2">Ir para Consulta de Relatórios</Text>
            <ArrowRight color="#3498db" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}