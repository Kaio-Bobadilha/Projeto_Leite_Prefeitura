import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Save } from 'lucide-react-native';

export default function AdulterantSummaryScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dateTime: new Date().toLocaleString('pt-BR'),
    producerCode: '',
    producerName: '',
    adulterants: '',
    physicalChemicalStandards: '',
    analyst: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.dateTime.trim()) {
      newErrors.dateTime = 'Data e hora são obrigatórios';
    }
    
    if (!formData.producerCode.trim()) {
      newErrors.producerCode = 'Código do produtor é obrigatório';
    }
    
    if (!formData.producerName.trim()) {
      newErrors.producerName = 'Nome do produtor é obrigatório';
    }
    
    if (!formData.adulterants.trim()) {
      newErrors.adulterants = 'Adulterantes são obrigatórios';
    }
    
    if (!formData.physicalChemicalStandards.trim()) {
      newErrors.physicalChemicalStandards = 'Padrões físico-químicos são obrigatórios';
    }
    
    if (!formData.analyst.trim()) {
      newErrors.analyst = 'Analista é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Mock submission
      console.log('Form Data Submitted:', formData);
      Alert.alert(
        'Relatório Salvo',
        'O resumo de adulterantes foi salvo com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/'),
          },
        ]
      );
    } else {
      Alert.alert('Erro', 'Por favor, corrija os campos obrigatórios');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#3498db] pt-12 pb-6 px-4 rounded-b-3xl">
        <Text className="text-white text-2xl font-bold text-center">
          Relatório 5
        </Text>
        <Text className="text-white text-lg text-center mt-1">
          Resumo de Adulterantes e Padrões Físico-Químicos
        </Text>
      </View>

      {/* Form Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Date and Time */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Calendar color="#3498db" size={20} />
            <Text className="text-[#2c3e50] font-semibold ml-2">
              Data e Hora
            </Text>
          </View>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="text-gray-700">{formData.dateTime}</Text>
          </View>
          {errors.dateTime ? (
            <Text className="text-red-500 text-sm mt-1">{errors.dateTime}</Text>
          ) : null}
        </View>

        {/* Producer Code */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <User color="#3498db" size={20} />
            <Text className="text-[#2c3e50] font-semibold ml-2">
              Código do Produtor
            </Text>
          </View>
          <TextInput
            className={`bg-white rounded-lg p-4 border ${
              errors.producerCode ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Digite o código do produtor"
            value={formData.producerCode}
            onChangeText={(value) => handleInputChange('producerCode', value)}
          />
          {errors.producerCode ? (
            <Text className="text-red-500 text-sm mt-1">{errors.producerCode}</Text>
          ) : null}
        </View>

        {/* Producer Name */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <User color="#3498db" size={20} />
            <Text className="text-[#2c3e50] font-semibold ml-2">
              Nome do Produtor
            </Text>
          </View>
          <TextInput
            className={`bg-white rounded-lg p-4 border ${
              errors.producerName ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Digite o nome do produtor"
            value={formData.producerName}
            onChangeText={(value) => handleInputChange('producerName', value)}
          />
          {errors.producerName ? (
            <Text className="text-red-500 text-sm mt-1">{errors.producerName}</Text>
          ) : null}
        </View>

        {/* Adulterants */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <FileText color="#3498db" size={20} />
            <Text className="text-[#2c3e50] font-semibold ml-2">
              Adulterantes
            </Text>
          </View>
          <TextInput
            className={`bg-white rounded-lg p-4 border ${
              errors.adulterants ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Descreva os adulterantes encontrados"
            value={formData.adulterants}
            onChangeText={(value) => handleInputChange('adulterants', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.adulterants ? (
            <Text className="text-red-500 text-sm mt-1">{errors.adulterants}</Text>
          ) : null}
        </View>

        {/* Physical-Chemical Standards */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <FileText color="#3498db" size={20} />
            <Text className="text-[#2c3e50] font-semibold ml-2">
              Padrões Físico-Químicos
            </Text>
          </View>
          <TextInput
            className={`bg-white rounded-lg p-4 border ${
              errors.physicalChemicalStandards ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Descreva os padrões físico-químicos"
            value={formData.physicalChemicalStandards}
            onChangeText={(value) => handleInputChange('physicalChemicalStandards', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.physicalChemicalStandards ? (
            <Text className="text-red-500 text-sm mt-1">{errors.physicalChemicalStandards}</Text>
          ) : null}
        </View>

        {/* Analyst */}
        <View className="mb-8">
          <View className="flex-row items-center mb-2">
            <User color="#3498db" size={20} />
            <Text className="text-[#2c3e50] font-semibold ml-2">
              Analista Responsável
            </Text>
          </View>
          <TextInput
            className={`bg-white rounded-lg p-4 border ${
              errors.analyst ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Nome do analista"
            value={formData.analyst}
            onChangeText={(value) => handleInputChange('analyst', value)}
          />
          {errors.analyst ? (
            <Text className="text-red-500 text-sm mt-1">{errors.analyst}</Text>
          ) : null}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-[#2ecc71] rounded-xl py-4 flex-row items-center justify-center mb-6"
          onPress={handleSubmit}
        >
          <Save color="white" size={20} />
          <Text className="text-white text-lg font-bold ml-2">
            Salvar Relatório
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}