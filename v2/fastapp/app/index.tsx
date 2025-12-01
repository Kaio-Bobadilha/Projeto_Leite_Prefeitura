import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import {
  FileText,
  Users,
  Clipboard,
  TestTube,
  Shield,
  Thermometer,
  Package,
  ChevronRight,
  Plus,
  X,
  Search,
  Download,
  UserPlus,
  Truck,
  Factory,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const DashboardScreen = () => {
  const router = useRouter();
  const [activeReport, setActiveReport] = useState("all");
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Mock data for reports
  const reports = [
    {
      id: 1,
      title: "Coleta Inicial",
      type: "Relatório 1",
      date: "15/04/2024",
      time: "08:30",
      producer: "Fazenda São João",
      status: "completed",
    },
    {
      id: 2,
      title: "Análise Físico-Química",
      type: "Relatório 2",
      date: "15/04/2024",
      time: "10:15",
      producer: "Laticínio Vale do Leite",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Controle de Antibióticos",
      type: "Relatório 3",
      date: "14/04/2024",
      time: "14:20",
      producer: "Cooperativa dos Produtores",
      status: "completed",
    },
    {
      id: 4,
      title: "Controle de Pasteurização",
      type: "Relatório 4",
      date: "14/04/2024",
      time: "16:45",
      producer: "Indústria Láctea Premium",
      status: "pending",
    },
  ];

  const reportTypes = [
    { id: "all", name: "Todos", icon: FileText },
    { id: "producers", name: "Produtores", icon: Users },
    { id: "collectors", name: "Coletores", icon: Package },
    { id: "dairies", name: "Laticínios", icon: Thermometer },
  ];

  const reportCreationOptions = [
    {
      id: "relatorio1",
      title: "Relatório de Coleta Inicial",
      description: "Registro inicial da coleta de leite",
      icon: Clipboard,
      route: "/initial-collection-report",
    },
    {
      id: "relatorio2",
      title: "Análise Físico-Química",
      description: "Parâmetros físico-químicos do leite",
      icon: TestTube,
      route: "/physical-chemical-analysis",
    },
    {
      id: "relatorio3",
      title: "Controle de Antibióticos",
      description: "Teste de presença de antibióticos",
      icon: Shield,
      route: "/antibiotic-control",
    },
    {
      id: "relatorio4",
      title: "Controle de Pasteurização",
      description: "Monitoramento do processo de pasteurização",
      icon: Thermometer,
      route: "/pasteurization-control",
    },
    {
      id: "relatorio5",
      title: "Resumo de Adulterantes",
      description: "Detecção de substâncias adulterantes",
      icon: FileText,
      route: "/adulterant-summary",
    },
  ];

  const registrationOptions = [
    {
      id: "producer",
      title: "Cadastro de Produtores",
      description: "Registrar novos produtores de leite",
      icon: UserPlus,
      route: "/producer-registration",
    },
    {
      id: "collector",
      title: "Gerenciamento de Coletores",
      description: "Gerenciar motoristas e veículos",
      icon: Truck,
      route: "/collector-management",
    },
    {
      id: "dairy",
      title: "Informações do Laticínio",
      description: "Dados cadastrais do laticínio",
      icon: Factory,
      route: "/dairy-information",
    },
  ];

  const filteredReports =
    activeReport === "all"
      ? reports
      : reports.filter((report) => report.type.includes(activeReport));

  const navigateToReport = (route: string) => {
    setShowFabMenu(false);
    router.push(route);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Main Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="bg-blue-600 pt-12 pb-6 px-4 rounded-b-3xl">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">
                DairyQuality Control
              </Text>
              <Text className="text-blue-100 mt-1">
                Sistema de controle de qualidade
              </Text>
            </View>
            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
              <Users size={24} color="#fff" />
            </View>
          </View>

          <View className="mt-6 bg-white/20 rounded-xl p-4">
            <Text className="text-white text-lg font-semibold">
              Bem-vindo, Administrador
            </Text>
            <Text className="text-blue-100 mt-1">
              Último acesso: 15/04/2024 às 08:30
            </Text>
          </View>
        </View>

        {/* Quick Access Section */}
        <View className="mt-6 mx-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Acesso Rápido
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center"
              onPress={() => router.push("/report-consultation")}
            >
              <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-3">
                <Search size={24} color="#3498db" />
              </View>
              <Text className="font-medium text-gray-800 text-center">
                Consultar Relatórios
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center"
              onPress={() => setShowFabMenu(true)}
            >
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-3">
                <Plus size={24} color="#2ecc71" />
              </View>
              <Text className="font-medium text-gray-800 text-center">
                Criar Relatório
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Registration Section */}
        <View className="mt-6 mx-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Cadastros
          </Text>
          <View className="flex-row gap-4">
            {registrationOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center"
                  onPress={() => router.push(option.route)}
                >
                  <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mb-3">
                    <IconComponent size={24} color="#9b59b6" />
                  </View>
                  <Text className="font-medium text-gray-800 text-center">
                    {option.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* PDF Export Section */}
        <View className="mt-6 mx-4">
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            onPress={() => router.push("/pdf-export-selection")}
          >
            <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
              <Download size={24} color="#e74c3c" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-bold text-gray-800">
                Exportar Relatórios
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                Exporte seus relatórios em formato PDF
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Report Type Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 px-4"
        >
          <View className="flex-row gap-3">
            {reportTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  className={`px-4 py-3 rounded-xl flex-row items-center ${
                    activeReport === type.id
                      ? "bg-blue-600"
                      : "bg-white border border-gray-200"
                  }`}
                  onPress={() => setActiveReport(type.id)}
                >
                  <IconComponent
                    size={20}
                    color={activeReport === type.id ? "#fff" : "#3498db"}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      activeReport === type.id ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Stats Cards */}
        <View className="mt-6 mx-4">
          <View className="flex-row gap-4">
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm">Total de Relatórios</Text>
              <Text className="text-2xl font-bold text-gray-800 mt-1">24</Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm">Em Andamento</Text>
              <Text className="text-2xl font-bold text-orange-500 mt-1">3</Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm">Concluídos</Text>
              <Text className="text-2xl font-bold text-green-500 mt-1">21</Text>
            </View>
          </View>
        </View>

        {/* Reports Section */}
        <View className="mt-6 mx-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Relatórios Recentes
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/report-consultation")}
            >
              <Text className="text-blue-600 font-medium">Ver Todos</Text>
            </TouchableOpacity>
          </View>

          {filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="font-bold text-gray-800">
                      {report.title}
                    </Text>
                    <Text className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {report.type}
                    </Text>
                  </View>

                  <Text className="text-gray-600 mt-2 text-sm">
                    {report.producer}
                  </Text>

                  <View className="flex-row mt-3">
                    <Text className="text-gray-500 text-sm">
                      {report.date} • {report.time}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <View
                    className={`w-3 h-3 rounded-full ${
                      report.status === "completed"
                        ? "bg-green-500"
                        : report.status === "in-progress"
                          ? "bg-orange-500"
                          : "bg-gray-300"
                    }`}
                  />
                  <ChevronRight size={20} color="#9CA3AF" className="mt-2" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        onPress={() => setShowFabMenu(true)}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* FAB Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFabMenu}
        onRequestClose={() => setShowFabMenu(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowFabMenu(false)}
        >
          <View className="absolute bottom-24 right-6">
            {reportCreationOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  className="flex-row items-center mb-3 bg-white rounded-xl p-4 shadow-lg"
                  style={{
                    transform: [{ translateY: -index * 10 }],
                  }}
                  onPress={() => navigateToReport(option.route)}
                >
                  <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center mr-3">
                    <IconComponent size={20} color="#3498db" />
                  </View>
                  <View>
                    <Text className="font-medium text-gray-800">
                      {option.title}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {option.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              className="self-center mt-2 w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
              onPress={() => setShowFabMenu(false)}
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DashboardScreen;
