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
import { ChevronLeft, User, MapPin, Phone, Mail } from "lucide-react-native";

export default function ProducerRegistrationScreen() {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    cpfCnpj: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    email: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
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

    if (!formData.id.trim()) {
      newErrors.id = "ID is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.cpfCnpj.trim()) {
      newErrors.cpfCnpj = "CPF/CNPJ is required";
    } else if (formData.cpfCnpj.replace(/\D/g, "").length < 11) {
      newErrors.cpfCnpj = "Invalid CPF/CNPJ format";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (formData.postalCode.replace(/\D/g, "").length !== 8) {
      newErrors.postalCode = "Invalid postal code";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Success", "Producer registered successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);

        // Reset form after successful submission
        setFormData({
          id: "",
          name: "",
          cpfCnpj: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          phone: "",
          email: "",
        });
      }, 1500);
    }
  };

  // Format CPF/CNPJ
  const formatCpfCnpj = (value: string) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 11) {
      // Formatting as CPF: XXX.XXX.XXX-XX
      return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    } else {
      // Formatting as CNPJ: XX.XXX.XXX/XXXX-XX
      return digits
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
  };

  // Handle CPF/CNPJ input change
  const handleCpfCnpjChange = (value: string) => {
    const formattedValue = formatCpfCnpj(value);
    handleChange("cpfCnpj", formattedValue);
  };

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");

    // Formatting as (XX) XXXXX-XXXX
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  // Handle phone input change
  const handlePhoneChange = (value: string) => {
    const formattedValue = formatPhoneNumber(value);
    handleChange("phone", formattedValue);
  };

  // Format postal code
  const formatPostalCode = (value: string) => {
    const digits = value.replace(/\D/g, "");

    // Formatting as XXXXX-XXX
    return digits
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };

  // Handle postal code input change
  const handlePostalCodeChange = (value: string) => {
    const formattedValue = formatPostalCode(value);
    handleChange("postalCode", formattedValue);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView className="flex-1 px-4 pt-12 pb-6">
        {/* Header */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-4"
          >
            <ChevronLeft color="#3498db" size={24} />
            <Text className="ml-2 text-blue-500 text-lg font-medium">Back</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Cadastro de produtor
          </Text>
          <Text className="text-gray-600">
            Cadastre um novo produtor no sistema
          </Text>
        </View>

        {/* Form */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* ID Field */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">
              Producer ID *
            </Text>
            <TextInput
              value={formData.id}
              onChangeText={(value) => handleChange("id", value)}
              placeholder="Enter producer ID"
              className={`border ${errors.id ? "border-red-500" : "border-gray-300"} rounded-lg p-4 text-gray-800 bg-gray-50`}
              keyboardType="numeric"
            />
            {errors.id && (
              <Text className="text-red-500 mt-1">{errors.id}</Text>
            )}
          </View>

          {/* Name Field */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">
              Nome completo*
            </Text>
            <View className="relative">
              <User
                size={20}
                color="#7f8c8d"
                className="absolute left-4 top-4"
              />
              <TextInput
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
                placeholder="Insira o nome completo"
                className={`border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg p-4 pl-12 text-gray-800 bg-gray-50`}
              />
            </View>
            {errors.name && (
              <Text className="text-red-500 mt-1">{errors.name}</Text>
            )}
          </View>

          {/* CPF/CNPJ Field */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">CPF/CNPJ *</Text>
            <TextInput
              value={formData.cpfCnpj}
              onChangeText={handleCpfCnpjChange}
              placeholder="Insira CPF ou CNPJ"
              className={`border ${errors.cpfCnpj ? "border-red-500" : "border-gray-300"} rounded-lg p-4 text-gray-800 bg-gray-50`}
              keyboardType="numeric"
            />
            {errors.cpfCnpj && (
              <Text className="text-red-500 mt-1">{errors.cpfCnpj}</Text>
            )}
          </View>

          {/* Address Section */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">
              Endereço completo
            </Text>
            <View className="relative">
              <MapPin
                size={20}
                color="#7f8c8d"
                className="absolute left-4 top-4"
              />
              <TextInput
                value={formData.address}
                onChangeText={(value) => handleChange("address", value)}
                placeholder="Rua"
                className={`border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-lg p-4 pl-12 text-gray-800 bg-gray-50 mb-3`}
              />
            </View>
            {errors.address && (
              <Text className="text-red-500 mt-1">{errors.address}</Text>
            )}

            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextInput
                  value={formData.city}
                  onChangeText={(value) => handleChange("city", value)}
                  placeholder="Cidade"
                  className={`border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-lg p-4 text-gray-800 bg-gray-50`}
                />
                {errors.city && (
                  <Text className="text-red-500 mt-1">{errors.city}</Text>
                )}
              </View>

              <View className="w-20">
                <TextInput
                  value={formData.state}
                  onChangeText={(value) => handleChange("state", value)}
                  placeholder="Estado"
                  className={`border ${errors.state ? "border-red-500" : "border-gray-300"} rounded-lg p-4 text-gray-800 bg-gray-50`}
                  maxLength={2}
                />
                {errors.state && (
                  <Text className="text-red-500 mt-1">{errors.state}</Text>
                )}
              </View>

              <View className="flex-1">
                <TextInput
                  value={formData.postalCode}
                  onChangeText={handlePostalCodeChange}
                  placeholder="CEP"
                  className={`border ${errors.postalCode ? "border-red-500" : "border-gray-300"} rounded-lg p-4 text-gray-800 bg-gray-50`}
                  keyboardType="numeric"
                />
                {errors.postalCode && (
                  <Text className="text-red-500 mt-1">{errors.postalCode}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">
              Informações de contato
            </Text>

            <View className="relative mb-3">
              <Phone
                size={20}
                color="#7f8c8d"
                className="absolute left-4 top-4"
              />
              <TextInput
                value={formData.phone}
                onChangeText={handlePhoneChange}
                placeholder="(00) 00000-0000"
                className={`border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg p-4 pl-12 text-gray-800 bg-gray-50`}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && (
              <Text className="text-red-500 mt-1">{errors.phone}</Text>
            )}

            <View className="relative">
              <Mail
                size={20}
                color="#7f8c8d"
                className="absolute left-4 top-4"
              />
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                placeholder="email@example.com"
                className={`border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg p-4 pl-12 text-gray-800 bg-gray-50`}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 mt-1">{errors.email}</Text>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-xl items-center justify-center ${isLoading ? "bg-blue-400" : "bg-blue-500"}`}
        >
          <Text className="text-white text-lg font-semibold">
            {isLoading ? "Registrando..." : "Registrar produtor"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
