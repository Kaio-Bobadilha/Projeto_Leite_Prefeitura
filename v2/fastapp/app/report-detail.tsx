import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Thermometer, TestTube, User, FileText, CheckCircle, XCircle } from 'lucide-react-native';

// Define types for our report data
type ReportType = 'initial-collection' | 'physical-chemical' | 'antibiotic' | 'pasteurization' | 'adulterant';

interface BaseReport {
  id: string;
  type: ReportType;
  date: string;
  time?: string;
  producerCode?: string;
  producerName?: string;
  analyst?: string;
  responsiblePerson?: string;
}

interface InitialCollectionReport extends BaseReport {
  tankNumber: string;
  temperature: string;
  alizarolTest: string;
}

interface PhysicalChemicalReport extends BaseReport {
  ph: string;
  acidity: string;
  density: string;
  cryoscopy: string;
  fat: string;
  protein: string;
  esd: string;
  est: string;
  lactose: string;
  antibiotics: string;
  preservatives: string;
}

interface AntibioticReport extends BaseReport {
  sampleId: string;
  antibioticType: string;
  result: 'positive' | 'negative';
  inhibition: string;
}

interface PasteurizationReport extends BaseReport {
  equipmentId: string;
  startTime: string;
  endTime: string;
  initialTemp: string;
  finalTemp: string;
  holdingTime: string;
  observations: string;
}

interface AdulterantReport extends BaseReport {
  adulterants: string;
  physicalChemicalStandards: string;
}

type ReportData = 
  | InitialCollectionReport
  | PhysicalChemicalReport
  | AntibioticReport
  | PasteurizationReport
  | AdulterantReport;

export default function ReportDetailScreen() {
  const router = useRouter();
  
  // Mock data for demonstration - in a real app this would come from navigation params
  const [reportData] = useState<ReportData>({
    id: 'REP-001',
    type: 'initial-collection',
    date: '15/04/2024',
    time: '08:30',
    tankNumber: 'TN-2024-A',
    producerCode: 'PC-7890',
    producerName: 'Fazenda Santa Clara',
    temperature: '4.2°C',
    alizarolTest: 'Negativo',
    responsiblePerson: 'Carlos Silva'
  });

  // Get title based on report type
  const getReportTitle = (type: ReportType) => {
    switch(type) {
      case 'initial-collection': return 'Relatório 1 - Coleta Inicial';
      case 'physical-chemical': return 'Relatório 2 - Análise Físico-Química';
      case 'antibiotic': return 'Relatório 3 - Controle de Antibióticos';
      case 'pasteurization': return 'Relatório 4 - Controle de Pasteurização';
      case 'adulterant': return 'Relatório 5 - Resumo de Adulterantes';
      default: return 'Detalhes do Relatório';
    }
  };

  // Get subtitle based on report type
  const getReportSubtitle = (type: ReportType) => {
    switch(type) {
      case 'initial-collection': return 'Detalhes da coleta inicial de leite';
      case 'physical-chemical': return 'Análise física e química da amostra';
      case 'antibiotic': return 'Resultados do controle de antibióticos';
      case 'pasteurization': return 'Detalhes do processo de pasteurização';
      case 'adulterant': return 'Resumo de adulterantes e padrões';
      default: return 'Informações detalhadas do relatório';
    }
  };

  // Render content based on report type
  const renderReportContent = () => {
    switch(reportData.type) {
      case 'initial-collection':
        return (
          <View>
            {/* Tank Information */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Informações do Tanque</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Número do Tanque:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as InitialCollectionReport).tankNumber}</Text>
              </View>
            </View>
            
            {/* Producer Information */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Informações do Produtor</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Código:</Text>
                <Text className="text-gray-800 font-medium">{reportData.producerCode}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Nome:</Text>
                <Text className="text-gray-800 font-medium">{reportData.producerName}</Text>
              </View>
            </View>
            
            {/* Temperature */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
                <Thermometer color="#3498db" size={20} className="mr-2" />
                Temperatura
              </Text>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Valor Registrado:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as InitialCollectionReport).temperature}</Text>
              </View>
            </View>
            
            {/* Alizarol Test */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
                <TestTube color="#3498db" size={20} className="mr-2" />
                Teste de Alizarol
              </Text>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Resultado:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as InitialCollectionReport).alizarolTest}</Text>
              </View>
            </View>
            
            {/* Responsible Person */}
            <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
                <User color="#3498db" size={20} className="mr-2" />
                Pessoa Responsável
              </Text>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Nome:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as InitialCollectionReport).responsiblePerson}</Text>
              </View>
            </View>
          </View>
        );
      
      case 'physical-chemical':
        return (
          <View>
            {/* Chemical Properties */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Propriedades Químicas</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">pH:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).ph}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Acidez (%):</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).acidity}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Densidade (g/cm³):</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).density}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Crioscopia (°C):</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).cryoscopy}</Text>
              </View>
            </View>
            
            {/* Composition */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Composição</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Gordura (%):</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).fat}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Proteína (%):</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).protein}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Lactose (%):</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).lactose}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">ESD:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).esd}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">EST:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).est}</Text>
              </View>
            </View>
            
            {/* Additional Information */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Informações Adicionais</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Antibióticos:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).antibiotics}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Conservantes:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PhysicalChemicalReport).preservatives}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Analista:</Text>
                <Text className="text-gray-800 font-medium">{reportData.analyst}</Text>
              </View>
            </View>
          </View>
        );
        
      case 'antibiotic':
        return (
          <View>
            {/* Sample Information */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Informações da Amostra</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">ID da Amostra:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as AntibioticReport).sampleId}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Tipo de Antibiótico:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as AntibioticReport).antibioticType}</Text>
              </View>
            </View>
            
            {/* Results */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Resultados</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Resultado:</Text>
                <View className="flex-row items-center">
                  {(reportData as AntibioticReport).result === 'positive' ? (
                    <>
                      <XCircle color="#e74c3c" size={18} className="mr-1" />
                      <Text className="text-red-500 font-medium">Positivo</Text>
                    </>
                  ) : (
                    <>
                      <CheckCircle color="#2ecc71" size={18} className="mr-1" />
                      <Text className="text-green-500 font-medium">Negativo</Text>
                    </>
                  )}
                </View>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Inibição:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as AntibioticReport).inhibition}</Text>
              </View>
            </View>
            
            {/* Analyst */}
            <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
                <User color="#3498db" size={20} className="mr-2" />
                Analista
              </Text>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Nome:</Text>
                <Text className="text-gray-800 font-medium">{reportData.analyst}</Text>
              </View>
            </View>
          </View>
        );
        
      case 'pasteurization':
        return (
          <View>
            {/* Equipment Information */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Equipamento</Text>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">ID do Equipamento:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PasteurizationReport).equipmentId}</Text>
              </View>
            </View>
            
            {/* Process Times */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Tempos do Processo</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Hora de Início:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PasteurizationReport).startTime}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Hora de Término:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PasteurizationReport).endTime}</Text>
              </View>
            </View>
            
            {/* Temperature Control */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Controle de Temperatura</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Temperatura Inicial:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PasteurizationReport).initialTemp}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Temperatura Final:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PasteurizationReport).finalTemp}</Text>
              </View>
            </View>
            
            {/* Holding Time */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Tempo de Manutenção</Text>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Duração:</Text>
                <Text className="text-gray-800 font-medium">{(reportData as PasteurizationReport).holdingTime}</Text>
              </View>
            </View>
            
            {/* Observations */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Observações</Text>
              <Text className="text-gray-800">{(reportData as PasteurizationReport).observations}</Text>
            </View>
            
            {/* Responsible Person */}
            <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
                <User color="#3498db" size={20} className="mr-2" />
                Pessoa Responsável
              </Text>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Nome:</Text>
                <Text className="text-gray-800 font-medium">{reportData.responsiblePerson}</Text>
              </View>
            </View>
          </View>
        );
        
      case 'adulterant':
        return (
          <View>
            {/* Producer Information */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3">Informações do Produtor</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Código:</Text>
                <Text className="text-gray-800 font-medium">{reportData.producerCode}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Nome:</Text>
                <Text className="text-gray-800 font-medium">{reportData.producerName}</Text>
              </View>
            </View>
            
            {/* Adulterants */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
                <FileText color="#3498db" size={20} className="mr-2" />
                Adulterantes
              </Text>
              <Text className="text-gray-800">{(reportData as AdulterantReport).adulterants}</Text>
            </View>
            
            {/* Standards */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
                <FileText color="#3498db" size={20} className="mr-2" />
                Padrões Físico-Químicos
              </Text>
              <Text className="text-gray-800">{(reportData as AdulterantReport).physicalChemicalStandards}</Text>
            </View>
            
            {/* Analyst */}
            <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
                <User color="#3498db" size={20} className="mr-2" />
                Analista
              </Text>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Nome:</Text>
                <Text className="text-gray-800 font-medium">{reportData.analyst}</Text>
              </View>
            </View>
          </View>
        );
        
      default:
        return (
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-gray-700 text-center">Dados do relatório não disponíveis</Text>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-6 px-4 shadow-sm">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-3 p-2 rounded-full bg-blue-400"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">{getReportTitle(reportData.type)}</Text>
        </View>
        <Text className="text-blue-100 text-sm ml-12">{getReportSubtitle(reportData.type)}</Text>
      </View>
      
      {/* Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Date and Time */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
            <Calendar color="#3498db" size={20} className="mr-2" />
            Data e Hora
          </Text>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Data:</Text>
            <Text className="text-gray-800 font-medium">{reportData.date}</Text>
          </View>
          
          {reportData.time && (
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-600">Hora:</Text>
              <Text className="text-gray-800 font-medium">{reportData.time}</Text>
            </View>
          )}
        </View>
        
        {/* Dynamic Content based on Report Type */}
        {renderReportContent()}
        
        {/* Report ID */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">ID do Relatório:</Text>
            <Text className="text-gray-800 font-medium">{reportData.id}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}