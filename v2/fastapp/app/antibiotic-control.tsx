import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Calendar, Clock, CheckCircle, XCircle } from "lucide-react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function AntibioticControlScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [classValue, setClassValue] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<"compliant" | "non-compliant" | null>(null);
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!classValue || !result || !status || !responsiblePerson) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
    }
    setIsLoading(true);
    try {
        const payload = {
            data: date.toISOString().split('T')[0], // YYYY-MM-DD
            hora: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            classe: classValue,
            resultado: result,
            status: status,
            responsavel: responsiblePerson
        };

        const response = await fetch(`${API_URL}/api/controle-antibiotico/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            Alert.alert("Sucesso", "Relatório de Antibióticos salvo!", [{ text: "OK", onPress: () => router.back() }]);
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
      <View className="bg-blue-600 pt-12 pb-6 px-4 shadow-md">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2 rounded-full bg-blue-500">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Controle de Antibióticos</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Data (Automática)</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg p-4">
                    <Calendar color="#3498db" size={20} className="mr-3" />
                    <Text>{date.toLocaleDateString()}</Text>
                </View>
            </View>
            
            <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Classe do Antibiótico</Text>
                <TextInput value={classValue} onChangeText={setClassValue} placeholder="Ex: Beta-lactâmicos" className="border border-gray-300 rounded-lg p-4" />
            </View>

            <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Resultado</Text>
                <TextInput value={result} onChangeText={setResult} placeholder="Resultado do teste" className="border border-gray-300 rounded-lg p-4" />
            </View>

            <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Status</Text>
                <View className="flex-row justify-between">
                    <TouchableOpacity onPress={() => setStatus("compliant")} className={`flex-row items-center justify-center flex-1 mr-2 p-4 rounded-lg border ${status === "compliant" ? "bg-green-100 border-green-500" : "bg-white border-gray-300"}`}>
                        <Text className={status === "compliant" ? "text-green-700" : "text-gray-500"}>Regular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setStatus("non-compliant")} className={`flex-row items-center justify-center flex-1 ml-2 p-4 rounded-lg border ${status === "non-compliant" ? "bg-red-100 border-red-500" : "bg-white border-gray-300"}`}>
                        <Text className={status === "non-compliant" ? "text-red-700" : "text-gray-500"}>Irregular</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="mb-2">
                <Text className="text-gray-700 font-medium mb-2">Responsável</Text>
                <TextInput value={responsiblePerson} onChangeText={setResponsiblePerson} placeholder="Nome" className="border border-gray-300 rounded-lg p-4" />
            </View>
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={isLoading} className="bg-green-600 py-4 rounded-xl shadow-md mb-6">
            <Text className="text-white text-center font-bold text-lg">{isLoading ? "Salvando..." : "Salvar Relatório"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}