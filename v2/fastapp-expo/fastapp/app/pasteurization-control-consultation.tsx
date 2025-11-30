import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, TestTube, User } from 'lucide-react-native';

// Define the report data structure
interface PasteurizationControlReport {
  id: string;
  date: string;
  time: string;
  phosphataseTest: string;
  peroxidaseTest: string;
  status: 'compliant' | 'non-compliant';
  responsiblePerson: string;
}

export default function PasteurizationControlConsultationScreen() {
  const router = useRouter();
  
  // Mock data for demonstration - in a real app this would come from navigation params
  const [reportData] = useState<PasteurizationControlReport>({
    id: 'REP-004',
    date: '17/04/2024',
    time: '14:45',
    phosphataseTest: 'Negativo',
    peroxidaseTest: 'Positivo',
    status: 'compliant',
    responsiblePerson: 'Carlos Eduardo Santos'
  });

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4 shadow-lg">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-4"
          >
            <ChevronLeft color="white" size={28} />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">Relatório 4</Text>
            <Text className="text-blue-100">Controle de Pasteurização</Text>
          </View>
        </View>
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
          
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-600">Hora:</Text>
            <Text className="text-gray-800 font-medium">{reportData.time}</Text>
          </View>
        </View>
        
        {/* Test Results */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
            <TestTube color="#3498db" size={20} className="mr-2" />
            Resultados dos Testes
          </Text>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Teste de Fosfatase:</Text>
            <Text className="text-gray-800 font-medium">{reportData.phosphataseTest}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Teste de Peroxidase:</Text>
            <Text className="text-gray-800 font-medium">{reportData.peroxidaseTest}</Text>
          </View>
        </View>
        
        {/* Status */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-bold mb-3">Status</Text>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Situação:</Text>
            <Text className={`font-medium ${
              reportData.status === 'compliant' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {reportData.status === 'compliant' ? 'Em Conformidade' : 'Não Conforme'}
            </Text>
          </View>
        </View>
        
        {/* Responsible Person */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
            <User color="#3498db" size={20} className="mr-2" />
            Responsável
          </Text>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Nome:</Text>
            <Text className="text-gray-800 font-medium">{reportData.responsiblePerson}</Text>
          </View>
        </View>
        
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