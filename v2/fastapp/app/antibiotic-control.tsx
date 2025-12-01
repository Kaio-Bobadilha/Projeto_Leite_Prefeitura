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
} from "lucide-react-native";

export default function AntibioticControlScreen() {
  const router = useRouter();

  // Form state
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [classValue, setClassValue] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<"compliant" | "non-compliant" | null>(
    null
  );
  const [responsiblePerson, setResponsiblePerson] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({
    classValue: "",
    result: "",
    status: "",
    responsiblePerson: "",
  });

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      classValue: "",
      result: "",
      status: "",
      responsiblePerson: "",
    };

    if (!classValue.trim()) {
      newErrors.classValue = "Classe é obrigatória";
      isValid = false;
    }

    if (!result.trim()) {
      newErrors.result = "Resultado é obrigatório";
      isValid = false;
    }

    if (!status) {
      newErrors.status = "Estatus é obrigatório";
      isValid = false;
    }

    if (!responsiblePerson.trim()) {
      newErrors.responsiblePerson = "Pessoa responsável é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Mock submission
      const reportData = {
        date: date.toISOString().split("T")[0],
        time: time.toTimeString().substring(0, 5),
        classValue,
        result,
        status,
        responsiblePerson,
      };

      console.log("Antibiotic Control Report Submitted:", reportData);

      // Show success message
      Alert.alert(
        "Relatório Enviado",
        "O relatório de controle de antibióticos foi enviado com sucesso.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display
  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4 shadow-md">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-2 rounded-full bg-blue-500"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            Relatório de Controle de Antibióticos
          </Text>
        </View>
        <Text className="text-blue-100 ml-12">
          Preencha os dados do relatório
        </Text>
      </View>

      {/* Form */}
      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Dados da Amostra
          </Text>
          <Text className="text-gray-500 mb-6">
            Insira os detalhes para controle e análise de antibióticos
          </Text>

          {/* Date Field */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Data</Text>
            <View
              className={`flex-row items-center border ${errors.classValue ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
            >
              <Calendar color="#3498db" size={20} className="mr-3" />
              <Text className="text-gray-800 flex-1">{formatDate(date)}</Text>
            </View>
          </View>

          {/* Time Field */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Horário</Text>
            <View
              className={`flex-row items-center border ${errors.classValue ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
            >
              <Clock color="#3498db" size={20} className="mr-3" />
              <Text className="text-gray-800 flex-1">{formatTime(time)}</Text>
            </View>
          </View>

          {/* Class Field */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Classe</Text>
            <TextInput
              value={classValue}
              onChangeText={(text) => {
                setClassValue(text);
                if (errors.classValue) {
                  setErrors({ ...errors, classValue: "" });
                }
              }}
              placeholder="Insira a classe da amostra"
              className={`border ${errors.classValue ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
            />
            {errors.classValue ? (
              <Text className="text-red-500 mt-1">{errors.classValue}</Text>
            ) : null}
          </View>

          {/* Result Field */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Resultado</Text>
            <TextInput
              value={result}
              onChangeText={(text) => {
                setResult(text);
                if (errors.result) {
                  setErrors({ ...errors, result: "" });
                }
              }}
              placeholder="Insira o resultado do teste"
              className={`border ${errors.result ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
            />
            {errors.result ? (
              <Text className="text-red-500 mt-1">{errors.result}</Text>
            ) : null}
          </View>

          {/* Status Selection */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Estatus</Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => {
                  setStatus("compliant");
                  if (errors.status) {
                    setErrors({ ...errors, status: "" });
                  }
                }}
                className={`flex-row items-center justify-center flex-1 mr-2 p-4 rounded-lg border ${
                  status === "compliant"
                    ? "bg-green-100 border-green-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <CheckCircle
                  color={status === "compliant" ? "#2ecc71" : "#95a5a6"}
                  size={20}
                  className="mr-2"
                />
                <Text
                  className={
                    status === "compliant"
                      ? "text-green-700 font-medium"
                      : "text-gray-500"
                  }
                >
                  Regular
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setStatus("non-compliant");
                  if (errors.status) {
                    setErrors({ ...errors, status: "" });
                  }
                }}
                className={`flex-row items-center justify-center flex-1 ml-2 p-4 rounded-lg border ${
                  status === "non-compliant"
                    ? "bg-red-100 border-red-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <XCircle
                  color={status === "non-compliant" ? "#e74c3c" : "#95a5a6"}
                  size={20}
                  className="mr-2"
                />
                <Text
                  className={
                    status === "non-compliant"
                      ? "text-red-700 font-medium"
                      : "text-gray-500"
                  }
                >
                  Irregular
                </Text>
              </TouchableOpacity>
            </View>
            {errors.status ? (
              <Text className="text-red-500 mt-1">{errors.status}</Text>
            ) : null}
          </View>

          {/* Responsible Person Field */}
          <View className="mb-2">
            <Text className="text-gray-700 font-medium mb-2">
              Pessoa Reponsável
            </Text>
            <TextInput
              value={responsiblePerson}
              onChangeText={(text) => {
                setResponsiblePerson(text);
                if (errors.responsiblePerson) {
                  setErrors({ ...errors, responsiblePerson: "" });
                }
              }}
              placeholder="Insira o nome da pessoa responsável"
              className={`border ${errors.responsiblePerson ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
            />
            {errors.responsiblePerson ? (
              <Text className="text-red-500 mt-1">
                {errors.responsiblePerson}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 py-4 rounded-xl shadow-md mb-6"
        >
          <Text className="text-white text-center font-bold text-lg">
            Salvar Relatório
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
