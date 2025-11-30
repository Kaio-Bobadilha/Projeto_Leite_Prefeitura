import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Thermometer, TestTube, User, FileText } from 'lucide-react-native';

// Define the report data structure
interface PhysicalChemicalReport {
  id: string;
  date: string;
  time: string;
  temperature: string;
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
  analyst: string;
}

export default function PhysicalChemicalConsultationScreen() {
  const router = useRouter();
  
  // Mock data for demonstration - in a real app this would come from navigation params
  const [reportData] = useState<PhysicalChemicalReport>({
    id: 'REP-002',
    date: '15/04/2024',
    time: '10:15',
    temperature: '4.2°C',
    ph: '6.7',
    acidity: '0.17%',
    density: '1.032 g/cm³',
    cryoscopy: '-0.542°C',
    fat: '3.8%',
    protein: '3.2%',
    esd: '210',
    est: '180',
    lactose: '4.6%',
    antibiotics: 'Negative',
    preservatives: 'None detected',
    analyst: 'Ana Carolina Silva'
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
            <Text className="text-white text-xl font-bold">Relatório 2</Text>
            <Text className="text-blue-100">Análise Físico-Química</Text>
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
        
        {/* Physical Properties */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
            <Thermometer color="#3498db" size={20} className="mr-2" />
            Propriedades Físicas
          </Text>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Temperatura:</Text>
            <Text className="text-gray-800 font-medium">{reportData.temperature}</Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">pH:</Text>
            <Text className="text-gray-800 font-medium">{reportData.ph}</Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Acidez:</Text>
            <Text className="text-gray-800 font-medium">{reportData.acidity}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Densidade:</Text>
            <Text className="text-gray-800 font-medium">{reportData.density}</Text>
          </View>
        </View>
        
        {/* Chemical Properties */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
            <TestTube color="#3498db" size={20} className="mr-2" />
            Propriedades Químicas
          </Text>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Crioscopia:</Text>
            <Text className="text-gray-800 font-medium">{reportData.cryoscopy}</Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Gordura:</Text>
            <Text className="text-gray-800 font-medium">{reportData.fat}</Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Proteína:</Text>
            <Text className="text-gray-800 font-medium">{reportData.protein}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Lactose:</Text>
            <Text className="text-gray-800 font-medium">{reportData.lactose}</Text>
          </View>
        </View>
        
        {/* Composition */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-bold mb-3">Composição</Text>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">ESD:</Text>
            <Text className="text-gray-800 font-medium">{reportData.esd}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">EST:</Text>
            <Text className="text-gray-800 font-medium">{reportData.est}</Text>
          </View>
        </View>
        
        {/* Additional Information */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
            <FileText color="#3498db" size={20} className="mr-2" />
            Informações Adicionais
          </Text>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Antibióticos:</Text>
            <Text className="text-gray-800 font-medium">{reportData.antibiotics}</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Conservantes:</Text>
            <Text className="text-gray-800 font-medium">{reportData.preservatives}</Text>
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