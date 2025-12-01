import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { FileText } from 'lucide-react-native';

interface PDFExportButtonProps {
  reportId: string;
  reportTitle: string;
  onExportPress: () => void;
}

export default function PDFExportButton({ reportId, reportTitle, onExportPress }: PDFExportButtonProps) {
  const handleExport = () => {
    Alert.alert(
      'Exportar para PDF',
      `Deseja exportar o ${reportTitle} (${reportId}) como PDF?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Exportar',
          onPress: onExportPress
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      className="flex-row items-center bg-blue-600 py-3 px-4 rounded-lg"
      onPress={handleExport}
    >
      <FileText color="#fff" size={20} />
      <Text className="text-white font-semibold ml-2">Exportar PDF</Text>
    </TouchableOpacity>
  );
}