import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Platform, Animated } from 'react-native';
import { Search, MapPin, X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TURKISH_CITIES } from '../data/cities';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LocationDropdown({ visible, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const { searchLocation, useCurrentLocation } = useApp();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setFilteredCities(TURKISH_CITIES); // Başlangıçta hepsini veya popülerleri göster
    } else {
      setQuery('');
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length === 0) {
      setFilteredCities(TURKISH_CITIES);
    } else {
      const filtered = TURKISH_CITIES.filter(city => 
        city.toLocaleLowerCase('tr').includes(text.toLocaleLowerCase('tr'))
      );
      setFilteredCities(filtered);
    }
  };

  const selectCity = (city: string) => {
    searchLocation(city);
    onClose();
  };

  const handleCurrentLocation = () => {
    useCurrentLocation();
    onClose();
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.searchBar}>
        <Search size={18} color="#9CA3AF" />
        <TextInput
          style={styles.input}
          placeholder="Şehir ara..."
          value={query}
          onChangeText={handleSearch}
          autoFocus
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.gpsItem} onPress={handleCurrentLocation}>
          <View style={styles.gpsIconBg}>
            <MapPin size={16} color="white" />
          </View>
          <Text style={styles.gpsText}>Mevcut Konumu Kullan</Text>
        </TouchableOpacity>

        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.cityItem} onPress={() => selectCity(item)}>
              <Text style={styles.cityText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Header'ın hemen altı
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#1F2937',
    height: 40,
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    maxHeight: 240,
  },
  list: {
    maxHeight: 190,
  },
  gpsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  gpsIconBg: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  gpsText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#059669',
  },
  cityItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  cityText: {
    fontSize: 15,
    color: '#374151',
    fontFamily: 'Inter_400Regular',
  },
});
