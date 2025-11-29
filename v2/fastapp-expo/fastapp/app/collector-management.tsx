import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert, ScrollView } from 'react-native';
import { Plus, Edit2, Trash2, X } from 'lucide-react-native';

interface Collector {
  id: string;
  driverName: string;
  licensePlate: string;
  vehicleModel: string;
  contactInfo: string;
}

export default function CollectorManagementScreen() {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCollector, setCurrentCollector] = useState<Collector | null>(null);
  const [driverName, setDriverName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Load mock data on component mount
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockCollectors: Collector[] = [
      {
        id: '1',
        driverName: 'Carlos Silva',
        licensePlate: 'ABC-1234',
        vehicleModel: 'Mercedes-Benz Sprinter',
        contactInfo: '(11) 98765-4321'
      },
      {
        id: '2',
        driverName: 'Roberto Santos',
        licensePlate: 'XYZ-5678',
        vehicleModel: 'Volkswagen Delivery',
        contactInfo: '(21) 91234-5678'
      },
      {
        id: '3',
        driverName: 'Mariana Costa',
        licensePlate: 'DEF-9012',
        vehicleModel: 'Ford Transit',
        contactInfo: '(31) 99876-5432'
      }
    ];
    setCollectors(mockCollectors);
  };

  const resetForm = () => {
    setDriverName('');
    setLicensePlate('');
    setVehicleModel('');
    setContactInfo('');
    setCurrentCollector(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const openEditModal = (collector: Collector) => {
    setCurrentCollector(collector);
    setDriverName(collector.driverName);
    setLicensePlate(collector.licensePlate);
    setVehicleModel(collector.vehicleModel);
    setContactInfo(collector.contactInfo);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const saveCollector = () => {
    if (!driverName || !licensePlate || !vehicleModel || !contactInfo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (currentCollector) {
      // Edit existing collector
      const updatedCollectors = collectors.map(collector => 
        collector.id === currentCollector.id 
          ? { ...collector, driverName, licensePlate, vehicleModel, contactInfo } 
          : collector
      );
      setCollectors(updatedCollectors);
    } else {
      // Add new collector
      const newCollector: Collector = {
        id: Date.now().toString(),
        driverName,
        licensePlate,
        vehicleModel,
        contactInfo
      };
      setCollectors([...collectors, newCollector]);
    }

    closeModal();
  };

  const deleteCollector = (id: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este coletor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            const updatedCollectors = collectors.filter(collector => collector.id !== id);
            setCollectors(updatedCollectors);
          }
        }
      ]
    );
  };

  const renderCollectorItem = ({ item }: { item: Collector }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.driverName}</Text>
          <Text className="text-gray-600 mt-1">Placa: {item.licensePlate}</Text>
          <Text className="text-gray-600">Veículo: {item.vehicleModel}</Text>
          <Text className="text-blue-600 mt-1">{item.contactInfo}</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity 
            className="p-2 mr-2"
            onPress={() => openEditModal(item)}
          >
            <Edit2 size={20} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="p-2"
            onPress={() => deleteCollector(item.id)}
          >
            <Trash2 size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">Gerenciamento de Coletores</Text>
        <Text className="text-gray-600 mt-1">Lista e gerencia os coletores de leite</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 p-4">
        {/* Add Button */}
        <TouchableOpacity 
          className="flex-row items-center justify-center bg-blue-500 py-3 rounded-lg mb-4"
          onPress={openAddModal}
        >
          <Plus size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Adicionar Coletor</Text>
        </TouchableOpacity>

        {/* Collectors List */}
        <FlatList
          data={collectors}
          keyExtractor={(item) => item.id}
          renderItem={renderCollectorItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500 text-lg">Nenhum coletor cadastrado</Text>
              <Text className="text-gray-400 mt-2">Toque em "Adicionar Coletor" para começar</Text>
            </View>
          }
        />
      </View>

      {/* Modal for Adding/Editing Collector */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-gray-50">
          {/* Modal Header */}
          <View className="bg-white p-4 flex-row justify-between items-center shadow-sm">
            <Text className="text-xl font-bold text-gray-800">
              {currentCollector ? 'Editar Coletor' : 'Novo Coletor'}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color="#95a5a6" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView className="flex-1 p-4">
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-gray-700 font-medium mb-2">Nome do Motorista *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Digite o nome completo"
                value={driverName}
                onChangeText={setDriverName}
              />

              <Text className="text-gray-700 font-medium mb-2">Placa do Veículo *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Ex: ABC-1234"
                value={licensePlate}
                onChangeText={setLicensePlate}
              />

              <Text className="text-gray-700 font-medium mb-2">Modelo do Veículo *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 mb-4"
                placeholder="Ex: Mercedes-Benz Sprinter"
                value={vehicleModel}
                onChangeText={setVehicleModel}
              />

              <Text className="text-gray-700 font-medium mb-2">Contato *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="Telefone ou email"
                value={contactInfo}
                onChangeText={setContactInfo}
              />
            </View>

            <TouchableOpacity 
              className="bg-blue-500 py-3 rounded-lg mb-4"
              onPress={saveCollector}
            >
              <Text className="text-white font-semibold text-center">
                {currentCollector ? 'Atualizar Coletor' : 'Adicionar Coletor'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-gray-200 py-3 rounded-lg"
              onPress={closeModal}
            >
              <Text className="text-gray-700 font-semibold text-center">Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}