import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Plus, Edit2, Trash2, X, ChevronLeft, Truck, User } from "lucide-react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

interface Collector {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  cnh: string;
  veiculo_details?: {
    id: number;
    placa: string;
    modelo: string;
  };
}

export default function CollectorManagementScreen() {
  const router = useRouter();
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Form States
  const [driverName, setDriverName] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnh, setCnh] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [phone, setPhone] = useState("");

  // Carregar dados toda vez que a tela focar
  useFocusEffect(
    useCallback(() => {
      fetchCollectors();
    }, [])
  );

  const fetchCollectors = async () => {
    setIsLoading(true);
    try {
      // Busca motoristas
      const response = await fetch(`${API_URL}/api/motoristas/`);
      const data = await response.json();
      
      // Para cada motorista, busca os detalhes do veículo se existir
      // (O ideal seria o serializer do Django já trazer isso, mas vamos buscar para garantir)
      const formattedData = await Promise.all(data.map(async (item: any) => {
        let veiculoDetails = null;
        if (item.veiculo) {
            // Se o backend retorna só o ID do veículo, buscamos os detalhes
            // Se já retornar o objeto, usamos direto. Vamos assumir que retorna ID ou Objeto.
            if (typeof item.veiculo === 'number') {
                 try {
                    const vResp = await fetch(`${API_URL}/api/motoristas/veiculos/${item.veiculo}/`);
                    veiculoDetails = await vResp.json();
                 } catch (e) { console.log('Erro ao buscar veiculo', e)}
            } else {
                veiculoDetails = item.veiculo;
            }
        }

        return {
            id: item.id.toString(),
            nome: item.nome,
            cpf: item.cpf,
            telefone: item.telefone,
            cnh: item.cnh,
            veiculo_details: veiculoDetails
        };
      }));

      setCollectors(formattedData);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os motoristas.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDriverName("");
    setCpf("");
    setCnh("");
    setLicensePlate("");
    setVehicleModel("");
    setPhone("");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const saveCollector = async () => {
    if (!driverName || !licensePlate || !cnh) {
      Alert.alert("Erro", "Nome, CNH e Placa são obrigatórios.");
      return;
    }

    setIsLoading(true);
    try {
        // 1. Criar (ou buscar) o Veículo primeiro
        const vehiclePayload = {
            placa: licensePlate.toUpperCase(),
            modelo: vehicleModel,
            compartimento: "Padrão" 
        };

        const vehicleResponse = await fetch(`${API_URL}/api/motoristas/veiculos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiclePayload)
        });

        try {
        console.log(`Tentando salvar em: ${API_URL}`); // DEBUG NO CONSOLE

        
        const vehicleResponse = await fetch(`${API_URL}/api/motoristas/veiculos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiclePayload)
        });
        console.log("Status Veículo:", vehicleResponse.status);
          } catch (error: any) {
        console.error("Erro detalhado:", error);
        Alert.alert("Erro de Conexão", `Não foi possível conectar em ${API_URL}.\nVerifique se o IP está correto e o Backend rodando.`);
    }
        // Se der erro no veículo (ex: placa duplicada), tentamos pegar o erro
        let vehicleId = null;
        if (vehicleResponse.ok) {
            const vData = await vehicleResponse.json();
            vehicleId = vData.id;
        } else {
            // Se falhar (ex: placa já existe), teríamos que buscar o ID da placa existente
            // Para o MVP, vamos alertar o erro
            const err = await vehicleResponse.json();
            if (JSON.stringify(err).includes("already exists")) {
                 Alert.alert("Atenção", "Veículo com esta placa já existe. Use outra placa para teste.");
                 setIsLoading(false);
                 return;
            }
            throw new Error("Falha ao criar veículo: " + JSON.stringify(err));
        }

        // 2. Criar o Motorista vinculado ao Veículo
        const driverPayload = {
            nome: driverName,
            cpf: cpf.replace(/\D/g, ""),
            cnh: cnh,
            telefone: phone,
            veiculo: vehicleId // Vincula o ID do veículo criado
        };

        const driverResponse = await fetch(`${API_URL}/api/motoristas/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driverPayload)
        });

        if (driverResponse.ok) {
            Alert.alert("Sucesso", "Motorista e Veículo cadastrados!");
            closeModal();
            fetchCollectors(); // Atualiza a lista
        } else {
            const errData = await driverResponse.json();
            Alert.alert("Erro Motorista", JSON.stringify(errData));
        }

    } catch (error: any) {
        Alert.alert("Erro", error.message);
    } finally {
        setIsLoading(false);
    }
  };
  

  const deleteCollector = (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja excluir este motorista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
                await fetch(`${API_URL}/api/motoristas/${id}/`, { method: 'DELETE' });
                fetchCollectors();
            } catch (error) {
                Alert.alert("Erro", "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  };

  const renderCollectorItem = ({ item }: { item: Collector }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <User size={18} color="#3498db" className="mr-2" />
            <Text className="text-lg font-bold text-gray-800">{item.nome}</Text>
          </View>
          
          <Text className="text-gray-600 text-sm ml-6 mb-2">CNH: {item.cnh}</Text>
          
          {item.veiculo_details ? (
             <View className="flex-row items-center bg-gray-50 p-2 rounded-md ml-6">
                <Truck size={16} color="#7f8c8d" className="mr-2" />
                <Text className="text-gray-700 font-medium">
                    {item.veiculo_details.placa} - {item.veiculo_details.modelo}
                </Text>
             </View>
          ) : (
            <Text className="text-orange-500 text-sm ml-6">Sem veículo vinculado</Text>
          )}
        </View>
        
        <TouchableOpacity
            className="p-2"
            onPress={() => deleteCollector(item.id)}
        >
            <Trash2 size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 shadow-sm pt-12">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="mr-3 p-2 rounded-full bg-blue-50"
          >
            <ChevronLeft size={24} color="#3498db" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800">
            Coletores e Veículos
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 p-4">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-blue-500 py-3 rounded-lg mb-4 shadow-sm"
          onPress={openAddModal}
        >
          <Plus size={20} color="white" />
          <Text className="text-white font-semibold ml-2">
            Adicionar Novo Coletor
          </Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator size="large" color="#3498db" className="mb-4" />}

        <FlatList
          data={collectors}
          keyExtractor={(item) => item.id}
          renderItem={renderCollectorItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading ? (
                <View className="items-center justify-center py-10">
                <Text className="text-gray-500 text-lg">Nenhum coletor encontrado</Text>
                </View>
            ) : null
          }
        />
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-gray-50">
          <View className="bg-white p-4 pt-6 flex-row justify-between items-center shadow-sm">
            <Text className="text-xl font-bold text-gray-800">Novo Cadastro</Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color="#95a5a6" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-blue-600 font-bold mb-4 uppercase text-xs">Dados do Motorista</Text>
              
              <Text className="text-gray-700 font-medium mb-1">Nome Completo *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3"
                value={driverName}
                onChangeText={setDriverName}
                placeholder="Nome do motorista"
              />

              <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-1">CPF</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 mb-3"
                        value={cpf}
                        onChangeText={setCpf}
                        keyboardType="numeric"
                        placeholder="000.000.000-00"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 font-medium mb-1">CNH *</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 mb-3"
                        value={cnh}
                        onChangeText={setCnh}
                        placeholder="Nº CNH"
                    />
                  </View>
              </View>

              <Text className="text-gray-700 font-medium mb-1">Telefone</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-1"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="(00) 00000-0000"
              />
            </View>

            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <Text className="text-blue-600 font-bold mb-4 uppercase text-xs">Dados do Veículo</Text>
              
              <Text className="text-gray-700 font-medium mb-1">Placa *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-3"
                value={licensePlate}
                onChangeText={setLicensePlate}
                autoCapitalize="characters"
                placeholder="ABC-1234"
              />

              <Text className="text-gray-700 font-medium mb-1">Modelo</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                value={vehicleModel}
                onChangeText={setVehicleModel}
                placeholder="Ex: Ford Cargo"
              />
            </View>

            <TouchableOpacity
              className={`py-4 rounded-lg mb-6 shadow-sm ${isLoading ? 'bg-blue-300' : 'bg-blue-600'}`}
              onPress={saveCollector}
              disabled={isLoading}
            >
              {isLoading ? (
                  <ActivityIndicator color="#fff" />
              ) : (
                  <Text className="text-white font-bold text-center text-lg">Salvar Cadastro</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}