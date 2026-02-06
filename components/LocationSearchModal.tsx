import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Search, MapPin } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LocationSearchModal({ visible, onClose }: Props) {
  const [query, setQuery] = useState('');
  const { searchLocation, useCurrentLocation } = useApp();

  const handleSearch = () => {
    if (query.trim().length > 2) {
      searchLocation(query);
      setQuery('');
      onClose();
    }
  };

  const handleCurrentLocation = () => {
    useCurrentLocation();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Konum Değiştir</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="Şehir adı girin (örn: İzmir)"
              value={query}
              onChangeText={setQuery}
              autoFocus={true}
              onSubmitEditing={handleSearch}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Ara</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <Text style={styles.dividerText}>veya</Text>
          </View>

          <TouchableOpacity style={styles.gpsButton} onPress={handleCurrentLocation}>
            <MapPin size={20} color="#10B981" />
            <Text style={styles.gpsButtonText}>Mevcut Konumu Kullan</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  gpsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    gap: 8,
  },
  gpsButtonText: {
    color: '#374151',
    fontFamily: 'Inter_600SemiBold',
  },
});
