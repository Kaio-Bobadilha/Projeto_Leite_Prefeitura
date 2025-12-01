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

export default function PasteurizationControlScreen() {
  const router = useRouter();

  // Form state
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [phosphataseTest, setPhosphataseTest] = useState("");
  const [peroxidaseTest, setPeroxidaseTest] = useState("");
  const [status, setStatus] = useState<"compliant" | "non-compliant" | null>(
    null
  );
  const [responsiblePerson, setResponsiblePerson] = useState("");

  // Manual date/time input states
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({
    date: "",
    time: "",
    phosphataseTest: "",
    peroxidaseTest: "",
    status: "",
    responsiblePerson: "",
  });

  // Handle manual date input
  const handleDateInput = (text: string) => {
    setDateInput(text);
    // Basic date validation (MM/DD/YYYY format)
    if (text.length === 10) {
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (datePattern.test(text)) {
        const [month, day, year] = text.split("/");
        const dateObj = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        if (
          dateObj.getDate() == parseInt(day) &&
          dateObj.getMonth() == parseInt(month) - 1 &&
          dateObj.getFullYear() == parseInt(year)
        ) {
          setDate(dateObj);
          setErrors({ ...errors, date: "" });
        } else {
          setErrors({ ...errors, date: "Invalid date" });
        }
      } else {
        setErrors({ ...errors, date: "Invalid date format (MM/DD/YYYY)" });
      }
    } else if (text.length === 0) {
      setErrors({ ...errors, date: "" });
    }
  };

  // Handle manual time input
  const handleTimeInput = (text: string) => {
    setTimeInput(text);
    // Basic time validation (HH:MM format)
    if (text.length === 5) {
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (timePattern.test(text)) {
        const [hours, minutes] = text.split(":").map(Number);
        const timeObj = new Date();
        timeObj.setHours(hours);
        timeObj.setMinutes(minutes);
        setTime(timeObj);
        setErrors({ ...errors, time: "" });
      } else {
        setErrors({ ...errors, time: "Invalid time format (HH:MM)" });
      }
    } else if (text.length === 0) {
      setErrors({ ...errors, time: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      date: "",
      time: "",
      phosphataseTest: "",
      peroxidaseTest: "",
      status: "",
      responsiblePerson: "",
    };

    // Validate date
    if (!dateInput.trim()) {
      newErrors.date = "Date is required";
      isValid = false;
    } else {
      const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!datePattern.test(dateInput)) {
        newErrors.date = "Invalid date format (MM/DD/YYYY)";
        isValid = false;
      } else {
        const [month, day, year] = dateInput.split("/");
        const dateObj = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        if (
          !(
            dateObj.getDate() == parseInt(day) &&
            dateObj.getMonth() == parseInt(month) - 1 &&
            dateObj.getFullYear() == parseInt(year)
          )
        ) {
          newErrors.date = "Invalid date";
          isValid = false;
        }
      }
    }

    // Validate time
    if (!timeInput.trim()) {
      newErrors.time = "Time is required";
      isValid = false;
    } else {
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timePattern.test(timeInput)) {
        newErrors.time = "Invalid time format (HH:MM)";
        isValid = false;
      }
    }

    if (!phosphataseTest.trim()) {
      newErrors.phosphataseTest = "Phosphatase test result is required";
      isValid = false;
    }

    if (!peroxidaseTest.trim()) {
      newErrors.peroxidaseTest = "Peroxidase test result is required";
      isValid = false;
    }

    if (!status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    if (!responsiblePerson.trim()) {
      newErrors.responsiblePerson = "Responsible person is required";
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
        date: dateInput,
        time: timeInput,
        phosphataseTest,
        peroxidaseTest,
        status,
        responsiblePerson,
      };

      console.log("Pasteurization Control Report Submitted:", reportData);

      // Show success message
      Alert.alert(
        "Report Submitted",
        "Pasteurization control report has been successfully submitted.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
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
            Relatório de controle de Pasteurização
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
            Resultados de Pasteuroização
          </Text>
          <Text className="text-gray-500 mb-6">
            Insira os resultados do teste
          </Text>

          {/* Date Field */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Data</Text>
            <View className="flex-row items-center">
              <Calendar color="#3498db" size={20} className="mr-3" />
              <TextInput
                value={dateInput}
                onChangeText={handleDateInput}
                placeholder="MM/DD/YYYY"
                keyboardType="numeric"
                maxLength={10}
                className={`flex-1 border ${errors.date ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
              />
            </View>
            {errors.date ? (
              <Text className="text-red-500 mt-1">{errors.date}</Text>
            ) : (
              <Text className="text-gray-500 mt-1 text-sm">
                {" "}
                Formato:DD/MM/YYYY
              </Text>
            )}
          </View>

          {/* Time Field */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Hora</Text>
            <View className="flex-row items-center">
              <Clock color="#3498db" size={20} className="mr-3" />
              <TextInput
                value={timeInput}
                onChangeText={handleTimeInput}
                placeholder="HH:MM"
                keyboardType="numeric"
                maxLength={5}
                className={`flex-1 border ${errors.time ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
              />
            </View>
            {errors.time ? (
              <Text className="text-red-500 mt-1">{errors.time}</Text>
            ) : (
              <Text className="text-gray-500 mt-1 text-sm">
                Formato 24 horas (exemplo 14:30)
              </Text>
            )}
          </View>

          {/* Phosphatase Test Field */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">
              Teste de Fosfatase
            </Text>
            <View className="flex-row items-center">
              <TestTube color="#3498db" size={20} className="mr-3" />
              <TextInput
                value={phosphataseTest}
                onChangeText={(text) => {
                  setPhosphataseTest(text);
                  if (errors.phosphataseTest) {
                    setErrors({ ...errors, phosphataseTest: "" });
                  }
                }}
                placeholder="Insira o resultado do teste de Fosfatase"
                className={`flex-1 border ${errors.phosphataseTest ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
              />
            </View>
            {errors.phosphataseTest ? (
              <Text className="text-red-500 mt-1">
                {errors.phosphataseTest}
              </Text>
            ) : null}
          </View>

          {/* Peroxidase Test Field */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">
              teste de peroxidase
            </Text>
            <View className="flex-row items-center">
              <TestTube color="#3498db" size={20} className="mr-3" />
              <TextInput
                value={peroxidaseTest}
                onChangeText={(text) => {
                  setPeroxidaseTest(text);
                  if (errors.peroxidaseTest) {
                    setErrors({ ...errors, peroxidaseTest: "" });
                  }
                }}
                placeholder="Insira o resultado do teste de peroxidase"
                className={`flex-1 border ${errors.peroxidaseTest ? "border-red-500" : "border-gray-300"} rounded-lg p-4 bg-white`}
              />
            </View>
            {errors.peroxidaseTest ? (
              <Text className="text-red-500 mt-1">{errors.peroxidaseTest}</Text>
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
              Pessoa Responsável
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
            Enviar relatório
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
