import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Save } from "lucide-react-native";

export default function PhysicalChemicalAnalysisScreen() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    dateTime: "",
    temperature: "",
    ph: "",
    acidity: "",
    density: "",
    cryoscopy: "",
    fat: "",
    protein: "",
    esd: "",
    est: "",
    lactose: "",
    antibiotics: "",
    preservatives: "",
    analyst: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

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

    // Required fields
    if (!formData.dateTime.trim()) newErrors.dateTime = "Date/time is required";
    if (!formData.temperature.trim())
      newErrors.temperature = "Temperature is required";
    if (!formData.ph.trim()) newErrors.ph = "pH is required";
    if (!formData.acidity.trim()) newErrors.acidity = "Acidity is required";
    if (!formData.density.trim()) newErrors.density = "Density is required";
    if (!formData.cryoscopy.trim())
      newErrors.cryoscopy = "Cryoscopy is required";
    if (!formData.fat.trim()) newErrors.fat = "Fat is required";
    if (!formData.protein.trim()) newErrors.protein = "Protein is required";
    if (!formData.esd.trim()) newErrors.esd = "ESD is required";
    if (!formData.est.trim()) newErrors.est = "EST is required";
    if (!formData.lactose.trim()) newErrors.lactose = "Lactose is required";
    if (!formData.analyst.trim()) newErrors.analyst = "Analyst is required";

    // Numeric validations
    if (formData.temperature && isNaN(Number(formData.temperature))) {
      newErrors.temperature = "Must be a valid number";
    }

    if (formData.ph && isNaN(Number(formData.ph))) {
      newErrors.ph = "Must be a valid number";
    }

    if (formData.acidity && isNaN(Number(formData.acidity))) {
      newErrors.acidity = "Must be a valid number";
    }

    if (formData.density && isNaN(Number(formData.density))) {
      newErrors.density = "Must be a valid number";
    }

    if (formData.cryoscopy && isNaN(Number(formData.cryoscopy))) {
      newErrors.cryoscopy = "Must be a valid number";
    }

    if (formData.fat && isNaN(Number(formData.fat))) {
      newErrors.fat = "Must be a valid number";
    }

    if (formData.protein && isNaN(Number(formData.protein))) {
      newErrors.protein = "Must be a valid number";
    }

    if (formData.esd && isNaN(Number(formData.esd))) {
      newErrors.esd = "Must be a valid number";
    }

    if (formData.est && isNaN(Number(formData.est))) {
      newErrors.est = "Must be a valid number";
    }

    if (formData.lactose && isNaN(Number(formData.lactose))) {
      newErrors.lactose = "Must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // In a real app, this would send data to a backend
      console.log("Form submitted:", formData);
      Alert.alert(
        "Success",
        "Physical-Chemical Analysis Report saved successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        "Validation Error",
        "Please fix the highlighted errors before submitting."
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4 shadow-lg">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft color="white" size={28} />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">
              Relatório de análise química
            </Text>
            <Text className="text-blue-100">Preencha os dados do reltório</Text>
          </View>
        </View>
      </View>

      {/* Form Content */}
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-gray-700 text-lg font-semibold mb-2">
            Informações de análise
          </Text>
          <Text className="text-gray-500 mb-4">
            Insira as informações físicas e químicas das propriedades da amostra
          </Text>

          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-gray-500 text-xs mb-1">Data e Hora *</Text>
            <TextInput
              value={formData.dateTime}
              onChangeText={(value) => handleInputChange("dateTime", value)}
              placeholder="DD/MM/YYYY HH:MM"
              className={`border rounded-lg p-3 ${errors.dateTime ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.dateTime ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.dateTime}
              </Text>
            ) : null}
          </View>

          <View className="flex-row flex-wrap gap-4">
            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">
                Temperatura (°C) *
              </Text>
              <TextInput
                value={formData.temperature}
                onChangeText={(value) =>
                  handleInputChange("temperature", value)
                }
                placeholder="Exemplo 4.2"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.temperature ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.temperature ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.temperature}
                </Text>
              ) : null}
            </View>

            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">pH *</Text>
              <TextInput
                value={formData.ph}
                onChangeText={(value) => handleInputChange("ph", value)}
                placeholder="Exemplo 6.7"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.ph ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.ph ? (
                <Text className="text-red-500 text-xs mt-1">{errors.ph}</Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row flex-wrap gap-4 mt-4">
            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">Acidez (%) *</Text>
              <TextInput
                value={formData.acidity}
                onChangeText={(value) => handleInputChange("acidity", value)}
                placeholder="Exemplo 0.17"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.acidity ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.acidity ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.acidity}
                </Text>
              ) : null}
            </View>

            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">
                Densidade (g/cm³) *
              </Text>
              <TextInput
                value={formData.density}
                onChangeText={(value) => handleInputChange("density", value)}
                placeholder="Exemplo 1.032"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.density ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.density ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.density}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row flex-wrap gap-4 mt-4">
            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">
                Crioscopia (°C) *
              </Text>
              <TextInput
                value={formData.cryoscopy}
                onChangeText={(value) => handleInputChange("cryoscopy", value)}
                placeholder="Exemplo -0.542"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.cryoscopy ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.cryoscopy ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.cryoscopy}
                </Text>
              ) : null}
            </View>

            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">Gordura (%) *</Text>
              <TextInput
                value={formData.fat}
                onChangeText={(value) => handleInputChange("fat", value)}
                placeholder="Exemplo 3.8"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.fat ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.fat ? (
                <Text className="text-red-500 text-xs mt-1">{errors.fat}</Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row flex-wrap gap-4 mt-4">
            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">Proteina (%) *</Text>
              <TextInput
                value={formData.protein}
                onChangeText={(value) => handleInputChange("protein", value)}
                placeholder="Exemplo 3.2"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.protein ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.protein ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.protein}
                </Text>
              ) : null}
            </View>

            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">ESD *</Text>
              <TextInput
                value={formData.esd}
                onChangeText={(value) => handleInputChange("esd", value)}
                placeholder="Exemplo 210"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.esd ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.esd ? (
                <Text className="text-red-500 text-xs mt-1">{errors.esd}</Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row flex-wrap gap-4 mt-4">
            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">EST *</Text>
              <TextInput
                value={formData.est}
                onChangeText={(value) => handleInputChange("est", value)}
                placeholder="Exemplo 180"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.est ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.est ? (
                <Text className="text-red-500 text-xs mt-1">{errors.est}</Text>
              ) : null}
            </View>

            <View className="basis-[48%]">
              <Text className="text-gray-500 text-xs mb-1">Lactose (%) *</Text>
              <TextInput
                value={formData.lactose}
                onChangeText={(value) => handleInputChange("lactose", value)}
                placeholder="Exemplo 4.6"
                keyboardType="numeric"
                className={`border rounded-lg p-3 ${errors.lactose ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.lactose ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.lactose}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-lg font-semibold mb-2">
            Informações Adicionais
          </Text>
          <Text className="text-gray-500 mb-4">
            Antibióticos específicos, conservantes e a análista
          </Text>

          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-gray-500 text-xs mb-1">Antibióticos</Text>
            <TextInput
              value={formData.antibiotics}
              onChangeText={(value) => handleInputChange("antibiotics", value)}
              placeholder="Exemplo Positivo"
              className="border border-gray-300 rounded-lg p-3"
            />
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-gray-500 text-xs mb-1">Conservantes</Text>
            <TextInput
              value={formData.preservatives}
              onChangeText={(value) =>
                handleInputChange("preservatives", value)
              }
              placeholder="Exemplo Nenhum Detectado"
              className="border border-gray-300 rounded-lg p-3"
            />
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-gray-500 text-xs mb-1">Análista *</Text>
            <TextInput
              value={formData.analyst}
              onChangeText={(value) => handleInputChange("analyst", value)}
              placeholder="Insira o nome do Análista "
              className={`border rounded-lg p-3 ${errors.analyst ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.analyst ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.analyst}
              </Text>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 py-3 rounded-xl flex-row items-center justify-center shadow-md"
        >
          <Save color="white" size={20} className="mr-2" />
          <Text className="text-white text-lg font-semibold">
            Salvar Relatório
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
