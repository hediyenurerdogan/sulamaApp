import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Platform, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { usePlants } from '../../context/PlantContext';
import AssistantHeader from '../../components/AssistantHeader';
import PlantAdviceCard from '../../components/PlantAdviceCard';
import { MapPin, ChevronDown, Plus } from 'lucide-react-native';
import LocationDropdown from '../../components/LocationDropdown';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { weather, loading, refreshWeather, locationName } = useApp();
  const { plants } = usePlants();
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Henüz Bitki Yok</Text>
      <Text style={styles.emptyDesc}>
        Asistanın analiz yapabilmesi için bitki eklemelisin.
      </Text>
      <TouchableOpacity 
        style={styles.ctaButton}
        onPress={() => router.push('/plants/add')}
      >
        <Plus size={18} color="white" />
        <Text style={styles.ctaText}>Bitki Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Area (Absolute for Location Dropdown z-index) */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.locationTrigger} 
          onPress={() => setDropdownVisible(!dropdownVisible)}
          activeOpacity={0.7}
        >
          <MapPin size={16} color="#059669" />
          <Text style={styles.locationText} numberOfLines={1}>{locationName}</Text>
          <ChevronDown size={14} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <LocationDropdown 
        visible={dropdownVisible} 
        onClose={() => setDropdownVisible(false)} 
      />

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlantAdviceCard plant={item} weather={weather} />
        )}
        ListHeaderComponent={
          <AssistantHeader plantCount={plants.length} locationName={locationName} />
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshWeather} tintColor="#10B981" />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
    zIndex: 10,
  },
  locationTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    maxWidth: '80%',
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    flexShrink: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter_400Regular',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  ctaText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});
