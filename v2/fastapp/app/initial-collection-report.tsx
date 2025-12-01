import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Calendar,
  Thermometer,
  TestTube,
  User,
  Save,
} from "lucide-react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function InitialCollectionReportScreen() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    tankNumber: "",
    producerId: "", // ID do Produtor no banco
    temperature: "",
    alizarolTest: "",
    // Campos opcionais/mockados para MVP se não tiver no form
    motoristaId: "", 
    veiculoId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date.trim()) newErrors.date = "Data é obrigatória";
    if (!formData.time.trim()) newErrors.time = "Hora é obrigatória";
    if (!formData.tankNumber.trim()) newErrors.tankNumber = "Nº Tanque obrigatório";
    if (!formData.producerId.trim()) newErrors.producerId = "ID Produtor obrigatório";
    if (!formData.temperature.trim()) newErrors.temperature = "Temperatura obrigatória";
    if (!formData.alizarolTest.trim()) newErrors.alizarolTest = "Alizarol obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Converter data/hora para ISO
        let isoDateTime = null;
        try {
            const [day, month, year] = formData.date.split('/');
            isoDateTime = `${year}-${month}-${day}T${formData.time}:00`;
        } catch (e) {
            Alert.alert("Erro", "Data inválida. Use DD/MM/AAAA");
            setIsLoading(false);
            return;
        }

        const parseNumber = (val: string) => parseFloat(val.replace(',', '.'));

        const payload = {
            data_coleta: isoDateTime,
            numero_tanque_produtor: formData.tankNumber,
            produtor: parseInt(formData.producerId), // Backend espera ID (número)
            temperatura_coleta: parseNumber(formData.temperature),
            alizarol_coleta: parseNumber(formData.alizarolTest),
            status: 'C', // Coletado (Default)
            coletado: true,
            
            // Enviando null se não preenchido, pois o model permite (null=True)
            motorista: formData.motoristaId ? parseInt(formData.motoristaId) : null,
            veiculo: formData.veiculoId ? parseInt(formData.veiculoId) : null,
            responsavel_carregamento: 1 // Temporário: ID 1 (Admin) ou pegar do login
        };

        const response = await fetch(`${API_URL}/api/lotes-coleta/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            Alert.alert("Sucesso", "Coleta registrada!", [
                { text: "OK", onPress: () => router.replace("/") }
            ]);
        } else {
            let errorMsg = "Erro:\n";
            Object.keys(data).forEach(key => errorMsg += `${key}: ${data[key]}\n`);
            Alert.alert("Erro ao Salvar", errorMsg);
        }

      } catch (error: any) {
        Alert.alert("Erro", "Falha de conexão: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1">
        <View className="bg-blue-500 pt-12 pb-6 px-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={() => router.replace("/")} className="mr-3 p-2 rounded-full bg-blue-400">
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Relatório de Coleta Inicial</Text>
          </View>
          <Text className="text-blue-100 text-sm ml-12">Insira os dados da coleta</Text>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
              <Calendar color="#3498db" size={20} className="mr-2" /> Data e Hora
            </Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-gray-600 text-sm mb-1">Data (DD/MM/AAAA)</Text>
                <TextInput
                  value={formData.date}
                  onChangeText={(value) => handleChange("date", value)}
                  placeholder="Ex: 25/12/2024"
                  className={`border rounded-lg p-3 ${errors.date ? "border-red-500" : "border-gray-300"}`}
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-600 text-sm mb-1">Hora (HH:MM)</Text>
                <TextInput
                  value={formData.time}
                  onChangeText={(value) => handleChange("time", value)}
                  placeholder="Ex: 08:30"
                  className={`border rounded-lg p-3 ${errors.time ? "border-red-500" : "border-gray-300"}`}
                />
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3">Dados da Origem</Text>
            
            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">ID do Produtor (Número)</Text>
              <TextInput
                value={formData.producerId}
                onChangeText={(value) => handleChange("producerId", value)}
                placeholder="ID do Produtor"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.producerId ? "border-red-500" : "border-gray-300"}`}
              />
            </View>

            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">Número do Tanque</Text>
              <TextInput
                value={formData.tankNumber}
                onChangeText={(value) => handleChange("tankNumber", value)}
                placeholder="Ex: TQ-01"
                className={`border rounded-lg p-3 ${errors.tankNumber ? "border-red-500" : "border-gray-300"}`}
              />
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
              <Thermometer color="#3498db" size={20} className="mr-2" /> Análise Rápida
            </Text>
            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">Temperatura (°C)</Text>
              <TextInput
                value={formData.temperature}
                onChangeText={(value) => handleChange("temperature", value)}
                placeholder="Ex: 4.5"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.temperature ? "border-red-500" : "border-gray-300"}`}
              />
            </View>
            <View>
              <Text className="text-gray-600 text-sm mb-1">Alizarol (ºGL)</Text>
              <TextInput
                value={formData.alizarolTest}
                onChangeText={(value) => handleChange("alizarolTest", value)}
                placeholder="Ex: 76"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.alizarolTest ? "border-red-500" : "border-gray-300"}`}
              />
            </View>
          </View>
        </ScrollView>

        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className="bg-green-500 rounded-xl py-4 flex-row items-center justify-center shadow-md"
          >
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <>
                    <Save color="white" size={20} className="mr-2" />
                    <Text className="text-white font-bold text-lg">Salvar Coleta</Text>
                </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}