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

export default function InitialCollectionReportScreen() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    tankNumber: "",
    producerCode: "",
    producerName: "",
    temperature: "",
    alizarolTest: "",
    responsiblePerson: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date.trim()) newErrors.date = "Date is required";
    if (!formData.time.trim()) newErrors.time = "Time is required";
    if (!formData.tankNumber.trim())
      newErrors.tankNumber = "Tank number is required";
    if (!formData.producerCode.trim())
      newErrors.producerCode = "Producer code is required";
    if (!formData.producerName.trim())
      newErrors.producerName = "Producer name is required";
    if (!formData.temperature.trim())
      newErrors.temperature = "Temperature is required";
    else if (isNaN(Number(formData.temperature)))
      newErrors.temperature = "Temperature must be a number";
    if (!formData.alizarolTest.trim())
      newErrors.alizarolTest = "Alizarol test result is required";
    if (!formData.responsiblePerson.trim())
      newErrors.responsiblePerson = "Responsible person is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, this would be an API call
      console.log("Form submitted:", formData);

      // Show success message
      Alert.alert("Success", "Initial Collection Report saved successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1">
        {/* Header */}
        <View className="bg-blue-500 pt-12 pb-6 px-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.replace("/")}
              className="mr-3 p-2 rounded-full bg-blue-400"
            >
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">
              Relatório de coleta inicial
            </Text>
          </View>
          <Text className="text-blue-100 text-sm ml-12">
            Fill in the collection details
          </Text>
        </View>

        {/* Form Content */}
        <ScrollView className="flex-1 px-4 py-6">
          {/* Data e Hora Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
              <Calendar color="#3498db" size={20} className="mr-2" />
              Date and Time
            </Text>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-gray-600 text-sm mb-1">Data</Text>
                <TextInput
                  value={formData.date}
                  onChangeText={(value) => handleChange("date", value)}
                  placeholder="DD/MM/YYYY"
                  className={`border rounded-lg p-3 ${errors.date ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.date ? (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.date}
                  </Text>
                ) : null}
              </View>

              <View className="flex-1">
                <Text className="text-gray-600 text-sm mb-1">Hora</Text>
                <TextInput
                  value={formData.time}
                  onChangeText={(value) => handleChange("time", value)}
                  placeholder="HH:MM"
                  className={`border rounded-lg p-3 ${errors.time ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.time ? (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.time}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          {/* Tank Information */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3">
              Informações do Tanque
            </Text>

            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">
                Número do Tanque
              </Text>
              <TextInput
                value={formData.tankNumber}
                onChangeText={(value) => handleChange("tankNumber", value)}
                placeholder="Insira o número do tanque"
                className={`border rounded-lg p-3 ${errors.tankNumber ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.tankNumber ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.tankNumber}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Producer Information */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3">
              Informações do produtor
            </Text>

            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">
                Código do Produtor
              </Text>
              <TextInput
                value={formData.producerCode}
                onChangeText={(value) => handleChange("producerCode", value)}
                placeholder="Insira o Código do Produtor"
                className={`border rounded-lg p-3 ${errors.producerCode ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.producerCode ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.producerCode}
                </Text>
              ) : null}
            </View>

            <View className="mb-3">
              <Text className="text-gray-600 text-sm mb-1">
                Nome do Produtor
              </Text>
              <TextInput
                value={formData.producerName}
                onChangeText={(value) => handleChange("producerName", value)}
                placeholder="Insira o código do Produtor"
                className={`border rounded-lg p-3 ${errors.producerName ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.producerName ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.producerName}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Temperature */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
              <Thermometer color="#3498db" size={20} className="mr-2" />
              Temperatura
            </Text>

            <View>
              <Text className="text-gray-600 text-sm mb-1">
                Temperatura (°C)
              </Text>
              <TextInput
                value={formData.temperature}
                onChangeText={(value) => handleChange("temperature", value)}
                placeholder="Insira a temperatura"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.temperature ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.temperature ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.temperature}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Alizarol Test */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
              <TestTube color="#3498db" size={20} className="mr-2" />
              Teste Alizraol
            </Text>

            <View>
              <Text className="text-gray-600 text-sm mb-1">Resultado</Text>
              <TextInput
                value={formData.alizarolTest}
                onChangeText={(value) => handleChange("alizarolTest", value)}
                placeholder="Insira o teste do resultado"
                className={`border rounded-lg p-3 ${errors.alizarolTest ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.alizarolTest ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.alizarolTest}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Responsible Person */}
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-gray-700 font-bold mb-3 flex flex-row items-center">
              <User color="#3498db" size={20} className="mr-2" />
              Pessoa Responsável
            </Text>

            <View>
              <Text className="text-gray-600 text-sm mb-1">Nome</Text>
              <TextInput
                value={formData.responsiblePerson}
                onChangeText={(value) =>
                  handleChange("responsiblePerson", value)
                }
                placeholder="Insira o nome do responsável"
                className={`border rounded-lg p-3 ${errors.responsiblePerson ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.responsiblePerson ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.responsiblePerson}
                </Text>
              ) : null}
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-green-500 rounded-xl py-4 flex-row items-center justify-center shadow-md"
          >
            <Save color="white" size={20} className="mr-2" />
            <Text className="text-white font-bold text-lg">
              Salvar Relatório
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
