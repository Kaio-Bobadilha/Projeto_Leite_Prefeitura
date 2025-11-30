import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, MapPin, Phone, Mail } from 'lucide-react-native';
import api from '../services/api'; 

export default function ProducerRegistrationScreen() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    id: '', // Usaremos isso como 'cad_pro' ou identificador externo
    name: '',
    cpfCnpj: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Validação (mantive a sua lógica original)
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.id.trim()) newErrors.id = 'ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.cpfCnpj.trim()) newErrors.cpfCnpj = 'CPF/CNPJ is required';
    
    // Validação simplificada para exemplo
    const cleanCpfCnpj = formData.cpfCnpj.replace(/\D/g, '');
    if (cleanCpfCnpj.length < 11) newErrors.cpfCnpj = 'Invalid CPF/CNPJ format';
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // NOVA LÓGICA DE ENVIO CONECTADA AO BACKEND
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const cleanDoc = formData.cpfCnpj.replace(/\D/g, '');
        const isPessoaJuridica = cleanDoc.length > 11;

        // Mapeamento para o modelo Django (Produtor)
        // Baseado no modelo em v2/back/produtor/models.py
        const payload = {
          tipo_pessoa: isPessoaJuridica ? 'JURIDICA' : 'FISICA',
          nome: formData.name,
          // Se for jurídica, usa razao_social, se física, usa nome.
          // Aqui estou enviando ambos para garantir compatibilidade
          razao_social: isPessoaJuridica ? formData.name : '',
          nome_fantasia: formData.name,
          
          cpf: !isPessoaJuridica ? cleanDoc : null,
          cnpj: isPessoaJuridica ? cleanDoc : null,
          cad_pro: formData.id, // Usando o ID do form como Cadastro de Produtor
          
          // Valores padrão exigidos pelo Django
          tipo_inscricao_estadual: 'CONTRIBUINTE_ISENTO', 
          
          email: formData.email,
          telefone: formData.phone,
          
          // Endereço
          rua: formData.address,
          cidade: formData.city,
          estado: formData.state,
          // O campo postalCode não existe no modelo do Django, 
          // você pode concatenar no complemento ou ignorar
          complemento: `CEP: ${formData.postalCode}`,
          
          // Campos obrigatórios que não estão no form (envie string vazia ou ajuste o modelo)
          inscricao_estadual: '', 
          inscricao_municipal: '',
          bairro: '',
          numero: '' 
        };

        // Envia para a rota configurada no Django
        await api.post('/produtores/', payload);

        Alert.alert(
          'Sucesso',
          'Produtor cadastrado com sucesso!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        
        // Limpar formulário
        setFormData({
          id: '', name: '', cpfCnpj: '', address: '',
          city: '', state: '', postalCode: '', phone: '', email: '',
        });

      } catch (error: any) {
        console.error('Erro ao cadastrar:', error);
        // Tenta pegar a mensagem de erro do Django
        const errorMsg = error.response?.data 
          ? JSON.stringify(error.response.data) 
          : 'Falha na conexão com o servidor';
          
        Alert.alert('Erro', `Falha ao cadastrar produtor: ${errorMsg}`);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Formatters (Mantidos do seu código original)
  const formatCpfCnpj = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      return digits
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };
  
  const handleCpfCnpjChange = (value: string) => {
    handleChange('cpfCnpj', formatCpfCnpj(value));
  };
  
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };
  
  const handlePhoneChange = (value: string) => {
    handleChange('phone', formatPhoneNumber(value));
  };
  
  const formatPostalCode = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };
  
  const handlePostalCodeChange = (value: string) => {
    handleChange('postalCode', formatPostalCode(value));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          
          <Text className="text-3xl font-bold text-gray-800 mb-2">Producer Registration</Text>
          <Text className="text-gray-600">Register a new producer in the system</Text>
        </View>
        
        {/* Form */}
        <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* ID Field */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Producer ID *</Text>
            <TextInput
              value={formData.id}
              onChangeText={(value) => handleChange('id', value)}
              placeholder="Enter producer ID"
              className={`border ${errors.id ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-gray-800 bg-gray-50`}
              keyboardType="numeric"
            />
            {errors.id && <Text className="text-red-500 mt-1">{errors.id}</Text>}
          </View>
          
          {/* Name Field */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Full Name *</Text>
            <View className="relative">
              <User size={20} color="#7f8c8d" className="absolute left-4 top-4" />
              <TextInput
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder="Enter full name"
                className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 pl-12 text-gray-800 bg-gray-50`}
              />
            </View>
            {errors.name && <Text className="text-red-500 mt-1">{errors.name}</Text>}
          </View>
          
          {/* CPF/CNPJ Field */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">CPF/CNPJ *</Text>
            <TextInput
              value={formData.cpfCnpj}
              onChangeText={handleCpfCnpjChange}
              placeholder="Enter CPF or CNPJ"
              className={`border ${errors.cpfCnpj ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-gray-800 bg-gray-50`}
              keyboardType="numeric"
            />
            {errors.cpfCnpj && <Text className="text-red-500 mt-1">{errors.cpfCnpj}</Text>}
          </View>
          
          {/* Address Section */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Full Address *</Text>
            <View className="relative">
              <MapPin size={20} color="#7f8c8d" className="absolute left-4 top-4" />
              <TextInput
                value={formData.address}
                onChangeText={(value) => handleChange('address', value)}
                placeholder="Street address"
                className={`border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 pl-12 text-gray-800 bg-gray-50 mb-3`}
              />
            </View>
            {errors.address && <Text className="text-red-500 mt-1">{errors.address}</Text>}
            
            <View className="flex-row gap-3">
              <View className="flex-1">
                <TextInput
                  value={formData.city}
                  onChangeText={(value) => handleChange('city', value)}
                  placeholder="City"
                  className={`border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-gray-800 bg-gray-50`}
                />
                {errors.city && <Text className="text-red-500 mt-1">{errors.city}</Text>}
              </View>
              
              <View className="w-20">
                <TextInput
                  value={formData.state}
                  onChangeText={(value) => handleChange('state', value)}
                  placeholder="State"
                  className={`border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-gray-800 bg-gray-50`}
                  maxLength={2}
                />
                {errors.state && <Text className="text-red-500 mt-1">{errors.state}</Text>}
              </View>
              
              <View className="flex-1">
                <TextInput
                  value={formData.postalCode}
                  onChangeText={handlePostalCodeChange}
                  placeholder="Postal code"
                  className={`border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-gray-800 bg-gray-50`}
                  keyboardType="numeric"
                />
                {errors.postalCode && <Text className="text-red-500 mt-1">{errors.postalCode}</Text>}
              </View>
            </View>
          </View>
          
          {/* Contact Information */}
          <View className="mb-5">
            <Text className="text-gray-700 font-medium mb-2">Contact Information *</Text>
            
            <View className="relative mb-3">
              <Phone size={20} color="#7f8c8d" className="absolute left-4 top-4" />
              <TextInput
                value={formData.phone}
                onChangeText={handlePhoneChange}
                placeholder="(00) 00000-0000"
                className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 pl-12 text-gray-800 bg-gray-50`}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && <Text className="text-red-500 mt-1">{errors.phone}</Text>}
            
            <View className="relative">
              <Mail size={20} color="#7f8c8d" className="absolute left-4 top-4" />
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="email@example.com"
                className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 pl-12 text-gray-800 bg-gray-50`}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text className="text-red-500 mt-1">{errors.email}</Text>}
          </View>
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={isLoading}
          className={`py-4 rounded-xl items-center justify-center ${isLoading ? 'bg-blue-400' : 'bg-blue-500'}`}
        >
          <Text className="text-white text-lg font-semibold">
            {isLoading ? 'Registering...' : 'Register Producer'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}