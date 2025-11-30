import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Save, Phone, Mail, MapPin, User, FileText } from 'lucide-react-native';

export default function DairyInformationScreen() {
  const router = useRouter();
  
  // Mock data for existing dairy information
  const [dairyData, setDairyData] = useState({
    id: 'L001',
    name: 'Fazenda Santa Clara',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 98765-4321',
    email: 'contato@santaclara.com.br',
    address: 'Rodovia BR-381, Km 45 - São João Del Rei, MG',
    responsible: 'Carlos Silva'
  });
  
  // Form state
  const [formData, setFormData] = useState(dairyData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    // In a real app, this would save to a database or API
    setDairyData(formData);
    setIsEditing(false);
    Alert.alert('Sucesso', 'Informações salvas com sucesso!');
  };

  const handleCancel = () => {
    setFormData(dairyData);
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4 shadow-md">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ChevronLeft color="white" size={28} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Informações da Laticínio</Text>
        </View>
        <Text className="text-blue-100 text-sm">
          Gerencie os dados cadastrais do laticínio
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Dairy Information Card */}
        <View className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <View className="flex-row items-center mb-4">
            <FileText color="#3498db" size={24} />
            <Text className="text-lg font-bold text-gray-800 ml-2">Dados Cadastrais</Text>
          </View>
          
          {!isEditing ? (
            <View>
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">ID</Text>
                <Text className="text-gray-800 font-medium">{dairyData.id}</Text>
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">Nome Fantasia</Text>
                <Text className="text-gray-800 font-medium">{dairyData.name}</Text>
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">CNPJ</Text>
                <Text className="text-gray-800 font-medium">{dairyData.cnpj}</Text>
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">Responsável</Text>
                <Text className="text-gray-800 font-medium">{dairyData.responsible}</Text>
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">Telefone</Text>
                <View className="flex-row items-center mt-1">
                  <Phone color="#7f8c8d" size={16} />
                  <Text className="text-gray-800 font-medium ml-2">{dairyData.phone}</Text>
                </View>
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</Text>
                <View className="flex-row items-center mt-1">
                  <Mail color="#7f8c8d" size={16} />
                  <Text className="text-gray-800 font-medium ml-2">{dairyData.email}</Text>
                </View>
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">Endereço</Text>
                <View className="flex-row items-start mt-1">
                  <MapPin color="#7f8c8d" size={16} />
                  <Text className="text-gray-800 font-medium ml-2 flex-1">{dairyData.address}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">ID</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                  value={formData.id}
                  onChangeText={(value) => handleInputChange('id', value)}
                  editable={false}
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Nome Fantasia *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">CNPJ *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.cnpj}
                  onChangeText={(value) => handleInputChange('cnpj', value)}
                  keyboardType="numeric"
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Responsável *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.responsible}
                  onChangeText={(value) => handleInputChange('responsible', value)}
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Telefone</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Email</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Endereço</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-2">
          {!isEditing ? (
            <TouchableOpacity 
              className="flex-1 bg-blue-600 py-4 rounded-xl items-center mr-2"
              onPress={() => setIsEditing(true)}
            >
              <Text className="text-white font-bold text-base">Editar Informações</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                className="flex-1 bg-gray-300 py-4 rounded-xl items-center mr-2"
                onPress={handleCancel}
              >
                <Text className="text-gray-800 font-bold text-base">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-green-600 py-4 rounded-xl items-center ml-2 flex-row justify-center"
                onPress={handleSave}
              >
                <Save color="white" size={20} />
                <Text className="text-white font-bold text-base ml-2">Salvar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}