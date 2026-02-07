import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePlants } from '../../../context/PlantContext';
import { PLANT_TYPES } from '../../../types';
import { ArrowLeft, Droplet, Sprout, Bell, Calendar, Trash2 } from 'lucide-react-native';
import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { plants, waterPlant, changeSoil, updatePlant, deletePlant } = usePlants();
  
  const plant = plants.find(p => p.id === id);
  const plantType = PLANT_TYPES.find(t => t.id === plant?.typeId);

  if (!plant) return null;

  const handleDelete = () => {
    Alert.alert(
      'Bitkiyi Sil',
      'Bu bitkiyi silmek istediğine emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive', 
          onPress: async () => {
            await deletePlant(plant.id);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{plant.name}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>Tür</Text>
              <Text style={styles.value}>{plantType?.name}</Text>
            </View>
            <View>
              <Text style={styles.label}>Konum</Text>
              <Text style={styles.value}>
                {plant.location.type} {plant.location.subType ? `(${plant.location.subType})` : ''}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Su İhtiyacı</Text>
              <Text style={styles.value}>{plant.waterNeed}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => waterPlant(plant.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBg, { backgroundColor: '#EFF6FF' }]}>
            <Droplet size={24} color="#3B82F6" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Bugün Suladım</Text>
            <Text style={styles.actionDesc}>
              Son: {plant.lastWateredDate 
                ? formatDistanceToNow(new Date(plant.lastWateredDate), { addSuffix: true, locale: tr })
                : 'Hiç sulanmadı'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => changeSoil(plant.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBg, { backgroundColor: '#F0FDF4' }]}>
            <Sprout size={24} color="#10B981" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Toprak Değişimi</Text>
            <Text style={styles.actionDesc}>
              Son: {plant.lastSoilChangeDate 
                ? format(new Date(plant.lastSoilChangeDate), 'd MMM yyyy', { locale: tr })
                : 'Kayıt yok'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#4B5563" />
              <Text style={styles.settingText}>Hatırlatıcı Bildirimleri</Text>
            </View>
            <Switch
              value={plant.notificationsEnabled}
              onValueChange={(val) => updatePlant(plant.id, { notificationsEnabled: val })}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  deleteBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Inter_500Medium',
  },
  value: {
    fontSize: 15,
    color: '#111827',
    fontFamily: 'Inter_600SemiBold',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Inter_500Medium',
  },
  settingsContainer: {
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 15,
    color: '#374151',
    fontFamily: 'Inter_500Medium',
  },
});
