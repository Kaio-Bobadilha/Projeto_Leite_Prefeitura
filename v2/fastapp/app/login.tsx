import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, User } from "lucide-react-native";

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Nome de usuário é obrigatório";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - accepts admin/admin
    if (username === "admin" && password === "admin") {
      setIsLoading(false);
      router.replace("/");
    } else {
      setIsLoading(false);
      Alert.alert(
        "Falha na autenticação",
        "Usuário ou senha incorretos. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Logo Section */}
          <View className="items-center mb-12">
            <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-6">
              <Lock size={48} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              DairyQuality Control
            </Text>
            <Text className="text-gray-600 text-center">
              Sistema de controle de qualidade para indústria de laticínios
            </Text>
          </View>

          {/* Login Form */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Entrar na sua conta
            </Text>

            {/* Username Field */}
            <View className="mb-5">
              <Text className="text-gray-700 font-medium mb-2">Usuário</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                <User size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-4 px-3 text-gray-800"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) {
                      setErrors({ ...errors, username: "" });
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.username ? (
                <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>
              ) : null}
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Senha</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4">
                <Lock size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 py-4 px-3 text-gray-800"
                  placeholder="Digite sua senha"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
              ) : null}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl items-center ${
                isLoading ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Demo Credentials Info */}
            <View className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Text className="text-blue-800 font-medium text-center">
                Para demonstração:
              </Text>
              <Text className="text-blue-700 text-center mt-1">
                Usuário: admin | Senha: admin
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-8">
            <Text className="text-gray-500 text-center">
              © 2024 DairyQuality Control. Todos os direitos reservados.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;