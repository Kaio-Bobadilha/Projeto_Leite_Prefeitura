import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Save, Phone, Mail, MapPin, User, FileText } from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function DairyInformationScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [dairyData, setDairyData] = useState({
    id: '', // ID do banco
    dbId: null, // ID numérico real
    name: '', // Razão Social
    cnpj: '',
    phone: '',
    email: '', // Não persiste no back atual
    address: '',
    responsible: '', // Não persiste no back atual
    regime: '' // Novo campo exigido pelo back
  });
  
  const [formData, setFormData] = useState(dairyData);

  useEffect(() => {
    fetchDairyInfo();
  }, []);

  const fetchDairyInfo = async () => {
    setIsLoading(true);
    try {
        // Pega o primeiro laticínio cadastrado (assumindo ser o do usuário atual)
        const response = await fetch(`${API_URL}/api/laticinios/`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const item = data[0];
            const loadedData = {
                id: `LAT-${item.id}`,
                dbId: item.id,
                name: item.razao_social,
                cnpj: item.cnpj,
                phone: item.telefone,
                email: 'admin@leite.com', // Mock visual
                address: item.endereco,
                responsible: 'Administrador', // Mock visual
                regime: item.regime_tributario
            };
            setDairyData(loadedData);
            setFormData(loadedData);
        }
    } catch (error) {
        console.log("Erro ao buscar laticínio:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
        const payload = {
            razao_social: formData.name,
            cnpj: formData.cnpj.replace(/\D/g, ""), // Limpa pontuação
            telefone: formData.phone,
            endereco: formData.address,
            regime_tributario: formData.regime || "Simples Nacional",
            inscricao_estadual: null 
        };

        let url = `${API_URL}/api/laticinios/`;
        let method = 'POST';

        if (formData.dbId) {
            url += `${formData.dbId}/`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Alert.alert('Sucesso', 'Informações salvas com sucesso!');
            fetchDairyInfo(); // Recarrega dados reais
            setIsEditing(false);
        } else {
            const err = await response.json();
            Alert.alert('Erro', 'Falha ao salvar: ' + JSON.stringify(err));
        }
    } catch (error) {
        Alert.alert('Erro', 'Falha de conexão');
    } finally {
        setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(dairyData);
    setIsEditing(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-blue-600 pt-12 pb-6 px-4 shadow-md">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ChevronLeft color="white" size={28} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Informações do Laticínio</Text>
        </View>
        <Text className="text-blue-100 text-sm">Gerencie os dados cadastrais</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {isLoading && <ActivityIndicator size="large" color="#3498db" className="mb-4" />}
        
        <View className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <View className="flex-row items-center mb-4">
            <FileText color="#3498db" size={24} />
            <Text className="text-lg font-bold text-gray-800 ml-2">Dados Cadastrais</Text>
          </View>
          
          {!isEditing ? (
            <View>
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">Razão Social</Text>
                <Text className="text-gray-800 font-medium">{dairyData.name || "Não informado"}</Text>
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">CNPJ</Text>
                <Text className="text-gray-800 font-medium">{dairyData.cnpj || "Não informado"}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">Endereço</Text>
                <View className="flex-row items-start mt-1">
                  <MapPin color="#7f8c8d" size={16} />
                  <Text className="text-gray-800 font-medium ml-2 flex-1">{dairyData.address || "Não informado"}</Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-1">Telefone</Text>
                <View className="flex-row items-center mt-1">
                  <Phone color="#7f8c8d" size={16} />
                  <Text className="text-gray-800 font-medium ml-2">{dairyData.phone || "Não informado"}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Razão Social *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.name}
                  onChangeText={(v) => handleInputChange('name', v)}
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">CNPJ *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.cnpj}
                  onChangeText={(v) => handleInputChange('cnpj', v)}
                  keyboardType="numeric"
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Telefone</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.phone}
                  onChangeText={(v) => handleInputChange('phone', v)}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Endereço</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.address}
                  onChangeText={(v) => handleInputChange('address', v)}
                  multiline
                />
              </View>

               <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-2">Regime Tributário</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  value={formData.regime}
                  placeholder="Ex: Simples Nacional"
                  onChangeText={(v) => handleInputChange('regime', v)}
                />
              </View>
            </View>
          )}
        </View>

        <View className="flex-row justify-between mt-2">
          {!isEditing ? (
            <TouchableOpacity 
              className="flex-1 bg-blue-600 py-4 rounded-xl items-center mr-2"
              onPress={() => setIsEditing(true)}
            >
              <Text className="text-white font-bold text-base">Editar / Cadastrar</Text>
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