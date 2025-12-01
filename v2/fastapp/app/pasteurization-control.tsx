import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TestTube,
} from "lucide-react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function PasteurizationControlScreen() {
  const router = useRouter();

  // Form inputs
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [phosphataseTest, setPhosphataseTest] = useState("");
  const [peroxidaseTest, setPeroxidaseTest] = useState("");
  const [status, setStatus] = useState<"compliant" | "non-compliant" | null>(null);
  const [responsiblePerson, setResponsiblePerson] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validação básica
    if (!dateInput || !timeInput || !phosphataseTest || !peroxidaseTest || !status || !responsiblePerson) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
    }

    setIsLoading(true);
    try {
        // Converter data de MM/DD/YYYY (formato do input original) para YYYY-MM-DD (Backend)
        const [month, day, year] = dateInput.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        const payload = {
            data: formattedDate,
            hora: timeInput, // Espera HH:MM
            teste_fosfatase: phosphataseTest,
            teste_peroxidase: peroxidaseTest,
            status: status,
            responsavel: responsiblePerson
        };

        const response = await fetch(`${API_URL}/api/controle-pasteurizacao/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Alert.alert("Sucesso", "Controle de Pasteurização salvo!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } else {
            const err = await response.json();
            Alert.alert("Erro", JSON.stringify(err));
        }
    } catch (error: any) {
        Alert.alert("Erro de Conexão", error.message);
    } finally {
        setIsLoading(false);
    }
  };

  // ... (Mantenha o restante do código visual/renderização igual, apenas substitua a função handleSubmit e imports)
  
  // Como o arquivo é grande, vou resumir:
  // Mantenha o return (...) igual ao original, apenas garanta que os inputs
  // estão ligados aos states acima.
  // Abaixo está o código visual completo para garantir que funcione:

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-blue-600 pt-12 pb-6 px-4 shadow-md">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2 rounded-full bg-blue-500">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Controle de Pasteurização</Text>
        </View>
        <Text className="text-blue-100 ml-12">Preencha os dados do relatório</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Data (MM/DD/AAAA)</Text>
            <View className="flex-row items-center">
              <Calendar color="#3498db" size={20} className="mr-3" />
              <TextInput
                value={dateInput}
                onChangeText={setDateInput}
                placeholder="12/31/2024"
                className="flex-1 border border-gray-300 rounded-lg p-4 bg-white"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Hora (HH:MM)</Text>
            <View className="flex-row items-center">
              <Clock color="#3498db" size={20} className="mr-3" />
              <TextInput
                value={timeInput}
                onChangeText={setTimeInput}
                placeholder="14:30"
                className="flex-1 border border-gray-300 rounded-lg p-4 bg-white"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Teste de Fosfatase</Text>
            <TextInput
                value={phosphataseTest}
                onChangeText={setPhosphataseTest}
                placeholder="Resultado"
                className="border border-gray-300 rounded-lg p-4 bg-white"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Teste de Peroxidase</Text>
            <TextInput
                value={peroxidaseTest}
                onChangeText={setPeroxidaseTest}
                placeholder="Resultado"
                className="border border-gray-300 rounded-lg p-4 bg-white"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Status</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setStatus("compliant")}
                className={`flex-row items-center justify-center flex-1 mr-2 p-4 rounded-lg border ${
                  status === "compliant" ? "bg-green-100 border-green-500" : "bg-white border-gray-300"
                }`}
              >
                <CheckCircle color={status === "compliant" ? "#2ecc71" : "#95a5a6"} size={20} className="mr-2" />
                <Text className={status === "compliant" ? "text-green-700" : "text-gray-500"}>Regular</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setStatus("non-compliant")}
                className={`flex-row items-center justify-center flex-1 ml-2 p-4 rounded-lg border ${
                  status === "non-compliant" ? "bg-red-100 border-red-500" : "bg-white border-gray-300"
                }`}
              >
                <XCircle color={status === "non-compliant" ? "#e74c3c" : "#95a5a6"} size={20} className="mr-2" />
                <Text className={status === "non-compliant" ? "text-red-700" : "text-gray-500"}>Irregular</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-2">
            <Text className="text-gray-700 font-medium mb-2">Responsável</Text>
            <TextInput
              value={responsiblePerson}
              onChangeText={setResponsiblePerson}
              placeholder="Nome do responsável"
              className="border border-gray-300 rounded-lg p-4 bg-white"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-xl shadow-md mb-6 ${isLoading ? 'bg-green-400' : 'bg-green-600'}`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isLoading ? "Enviando..." : "Enviar Relatório"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}