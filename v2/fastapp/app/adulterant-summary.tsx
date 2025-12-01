import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Calendar, User, FileText, Save, ChevronLeft } from "lucide-react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function AdulterantSummaryScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dateTime: new Date().toISOString(), // Data ISO automática
    producerCode: "",
    producerName: "",
    adulterants: "",
    physicalChemicalStandards: "",
    analyst: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.producerCode || !formData.adulterants) {
        Alert.alert("Erro", "Preencha os campos obrigatórios.");
        return;
    }
    setIsLoading(true);
    try {
        const payload = {
            data_hora: formData.dateTime,
            codigo_produtor: formData.producerCode,
            nome_produtor: formData.producerName,
            adulterantes: formData.adulterants,
            padroes_fisico_quimicos: formData.physicalChemicalStandards,
            analista: formData.analyst
        };

        const response = await fetch(`${API_URL}/api/resumo-adulterantes/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Alert.alert("Sucesso", "Resumo salvo!", [{ text: "OK", onPress: () => router.push("/") }]);
        } else {
            const err = await response.json();
            Alert.alert("Erro", JSON.stringify(err));
        }
    } catch (e: any) {
        Alert.alert("Erro", e.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#3498db] pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity onPress={() => router.push("/")} className="mr-3 p-2 rounded-full bg-blue-400">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Relatório 5</Text>
        </View>
        <Text className="text-white text-lg text-center mt-1">Resumo de Adulterantes</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="mb-6">
          <Text className="text-[#2c3e50] font-semibold mb-2">Data e Hora (Automático)</Text>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="text-gray-700">{new Date().toLocaleString()}</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-[#2c3e50] font-semibold mb-2">Código do Produtor</Text>
          <TextInput className="bg-white rounded-lg p-4 border border-gray-200" placeholder="Digite o código" value={formData.producerCode} onChangeText={(v) => handleInputChange("producerCode", v)} />
        </View>

        <View className="mb-6">
          <Text className="text-[#2c3e50] font-semibold mb-2">Nome do Produtor</Text>
          <TextInput className="bg-white rounded-lg p-4 border border-gray-200" placeholder="Digite o nome" value={formData.producerName} onChangeText={(v) => handleInputChange("producerName", v)} />
        </View>

        <View className="mb-6">
          <Text className="text-[#2c3e50] font-semibold mb-2">Adulterantes</Text>
          <TextInput className="bg-white rounded-lg p-4 border border-gray-200" placeholder="Descrição" multiline numberOfLines={4} value={formData.adulterants} onChangeText={(v) => handleInputChange("adulterants", v)} />
        </View>

        <View className="mb-6">
          <Text className="text-[#2c3e50] font-semibold mb-2">Padrões Físico-Químicos</Text>
          <TextInput className="bg-white rounded-lg p-4 border border-gray-200" placeholder="Descrição" multiline numberOfLines={4} value={formData.physicalChemicalStandards} onChangeText={(v) => handleInputChange("physicalChemicalStandards", v)} />
        </View>

        <View className="mb-8">
          <Text className="text-[#2c3e50] font-semibold mb-2">Analista</Text>
          <TextInput className="bg-white rounded-lg p-4 border border-gray-200" placeholder="Nome" value={formData.analyst} onChangeText={(v) => handleInputChange("analyst", v)} />
        </View>

        <TouchableOpacity className="bg-[#2ecc71] rounded-xl py-4 flex-row items-center justify-center mb-6" onPress={handleSubmit} disabled={isLoading}>
          <Save color="white" size={20} />
          <Text className="text-white text-lg font-bold ml-2">{isLoading ? "Salvando..." : "Salvar Relatório"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}