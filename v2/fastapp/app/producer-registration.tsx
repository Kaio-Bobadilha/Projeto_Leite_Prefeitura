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
import { ChevronLeft, User, MapPin, Phone, Mail } from "lucide-react-native";

// Use o IP da sua máquina se for rodar no celular, ou localhost se for web
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function ProducerRegistrationScreen() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    cpfCnpj: "",
    address: "",
    number: "",
    neighborhood: "", 
    state: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Format CPF/CNPJ
  const formatCpfCnpj = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    } else {
      return digits
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
  };

  const handleCpfCnpjChange = (value: string) => {
    handleChange("cpfCnpj", formatCpfCnpj(value));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    
    const cleanDoc = formData.cpfCnpj.replace(/\D/g, "");
    if (!cleanDoc) newErrors.cpfCnpj = "CPF/CNPJ é obrigatório";
    
    if (!formData.address.trim()) newErrors.address = "Rua é obrigatória";
    if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!formData.state.trim()) newErrors.state = "Estado é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);

      try {
        const cleanDoc = formData.cpfCnpj.replace(/\D/g, "");
        const isPessoaJuridica = cleanDoc.length > 11;

        // Payload mapeado para o modelo Django (Produtor)
        const payload = {
            tipo_pessoa: isPessoaJuridica ? 'JURIDICA' : 'FISICA',
            nome: formData.name, // Usando 'nome' para ambos por simplificação
            razao_social: isPessoaJuridica ? formData.name : null,
            cpf: isPessoaJuridica ? null : cleanDoc,
            cnpj: isPessoaJuridica ? cleanDoc : null,
            
            // Campos de endereço
            rua: formData.address,
            numero: formData.number || "S/N",
            bairro: formData.neighborhood || "",
            cidade: formData.city,
            estado: formData.state.toUpperCase(),
            
            // Contato
            email: formData.email || "naoinformado@exemplo.com",
            telefone: formData.phone,

            // Padrões obrigatórios do Backend (Defaults)
            tipo_inscricao_estadual: "NAO_CONTRIBUINTE_DE_ICMS", 
        };

        const response = await fetch(`${API_URL}/api/produtores/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            Alert.alert("Sucesso", "Produtor registrado com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } else {
            let errorMsg = "Erro ao salvar:\n";
            Object.keys(data).forEach(key => {
                errorMsg += `${key}: ${data[key]}\n`;
            });
            Alert.alert("Erro de Validação", errorMsg);
        }

      } catch (error: any) {
        Alert.alert("Erro", "Falha na conexão: " + error.message);
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
      <ScrollView className="flex-1 px-4 pt-12 pb-6">
        <View className="mb-6">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
            <ChevronLeft color="#3498db" size={24} />
            <Text className="ml-2 text-blue-500 text-lg font-medium">Voltar</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-800 mb-2">Cadastro de Produtor</Text>
          <Text className="text-gray-600">Cadastre um novo produtor no sistema</Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Nome Completo / Razão Social *</Text>
            <View className="relative">
              <User size={20} color="#7f8c8d" className="absolute left-4 top-4" />
              <TextInput
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
                placeholder="Insira o nome"
                className={`border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg p-4 pl-12 bg-gray-50`}
              />
            </View>
            {errors.name && <Text className="text-red-500 mt-1">{errors.name}</Text>}
          </View>

          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">CPF / CNPJ *</Text>
            <TextInput
              value={formData.cpfCnpj}
              onChangeText={handleCpfCnpjChange}
              placeholder="000.000.000-00"
              className={`border ${errors.cpfCnpj ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-gray-50`}
              keyboardType="numeric"
            />
            {errors.cpfCnpj && <Text className="text-red-500 mt-1">{errors.cpfCnpj}</Text>}
          </View>

          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Endereço (Rua) *</Text>
            <View className="relative">
              <MapPin size={20} color="#7f8c8d" className="absolute left-4 top-4" />
              <TextInput
                value={formData.address}
                onChangeText={(value) => handleChange("address", value)}
                placeholder="Nome da Rua"
                className={`border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-lg p-4 pl-12 bg-gray-50`}
              />
            </View>
            {errors.address && <Text className="text-red-500 mt-1">{errors.address}</Text>}
          </View>

            <View className="flex-row gap-3 mb-5">
                 <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-2">Número</Text>
                    <TextInput
                        value={formData.number}
                        onChangeText={(value) => handleChange("number", value)}
                        placeholder="Nº"
                        className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                    />
                 </View>
                 <View className="flex-[2]">
                    <Text className="text-gray-700 font-medium mb-2">Bairro</Text>
                    <TextInput
                        value={formData.neighborhood}
                        onChangeText={(value) => handleChange("neighborhood", value)}
                        placeholder="Bairro"
                        className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                    />
                 </View>
            </View>

          <View className="flex-row gap-3 mb-5">
            <View className="flex-[2]">
                <Text className="text-gray-700 font-medium mb-2">Cidade *</Text>
              <TextInput
                value={formData.city}
                onChangeText={(value) => handleChange("city", value)}
                placeholder="Cidade"
                className={`border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-gray-50`}
              />
            </View>
            <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">UF *</Text>
              <TextInput
                value={formData.state}
                onChangeText={(value) => handleChange("state", value)}
                placeholder="PR"
                className={`border ${errors.state ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-gray-50`}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Contato</Text>
            <View className="relative mb-3">
              <Phone size={20} color="#7f8c8d" className="absolute left-4 top-4" />
              <TextInput
                value={formData.phone}
                onChangeText={(value) => handleChange("phone", value)}
                placeholder="(00) 00000-0000"
                className="border border-gray-300 rounded-lg p-4 pl-12 bg-gray-50"
                keyboardType="phone-pad"
              />
            </View>
            <View className="relative">
              <Mail size={20} color="#7f8c8d" className="absolute left-4 top-4" />
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                placeholder="email@exemplo.com"
                className="border border-gray-300 rounded-lg p-4 pl-12 bg-gray-50"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-xl items-center justify-center mb-10 ${isLoading ? "bg-blue-400" : "bg-blue-500"}`}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Registrar Produtor</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}