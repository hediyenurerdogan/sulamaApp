import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plant, WeatherData, PLANT_TYPES } from '../types';
import { getPlantSpecificAdvice } from '../utils/irrigationLogic';
import { CloudRain, Sun, Thermometer, Droplet, Snowflake, Sprout, Check, ThumbsUp } from 'lucide-react-native';

interface Props {
  plant: Plant;
  weather: WeatherData | null;
}

export default function PlantAdviceCard({ plant, weather }: Props) {
  const [saved, setSaved] = useState(false);
  const advice = getPlantSpecificAdvice(plant, weather);
  const plantType = PLANT_TYPES.find(t => t.id === plant.typeId);

  const getIcon = () => {
    const size = 24;
    const color = advice.color;
    switch (advice.iconName) {
      case 'CloudRain': return <CloudRain size={size} color={color} />;
      case 'Sun': return <Sun size={size} color={color} />;
      case 'Thermometer': return <Thermometer size={size} color={color} />;
      case 'Snowflake': return <Snowflake size={size} color={color} />;
      case 'Droplet': return <Droplet size={size} color={color} />;
      default: return <Sprout size={size} color={color} />;
    }
  };

  const handleSaveWater = () => {
    setSaved(true);
    // Buraya global state update veya analytics event eklenebilir.
  };

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.plantLocation}>
            {plantType?.name} • {plant.location.type} 
            {plant.location.subType ? ` (${plant.location.subType})` : ''}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${advice.color}15` }]}>
          <Text style={[styles.statusText, { color: advice.color }]}>{advice.detail}</Text>
        </View>
      </View>

      {/* Advice Section */}
      <View style={styles.adviceContainer}>
        <View style={[styles.iconBox, { backgroundColor: `${advice.color}10` }]}>
          {getIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.adviceTitle, { color: advice.color }]}>{advice.title}</Text>
          <Text style={styles.adviceMessage}>{advice.message}</Text>
        </View>
      </View>

      {/* Savings Interaction */}
      {advice.canSaveWater && !saved && (
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsQuestion}>
            {plant.location.type === 'Saksı' ? 'Toprak hala nemli mi?' : 'Doğal sulama (yağmur) oldu mu?'}
          </Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveWater}>
            <Text style={styles.saveButtonText}>Evet</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Success State */}
      {saved && (
        <View style={styles.successContainer}>
          <ThumbsUp size={16} color="#059669" />
          <Text style={styles.successText}>
            Harika! Yaklaşık <Text style={{fontWeight: 'bold'}}>1.5 Litre</Text> su tasarrufu sağladın.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  plantInfo: {
    flex: 1,
    marginRight: 10,
  },
  plantName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 4,
  },
  plantLocation: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  adviceTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  adviceMessage: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  savingsQuestion: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#4B5563',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
    gap: 8,
  },
  successText: {
    fontSize: 12,
    color: '#065F46',
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
});
