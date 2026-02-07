import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plant, PLANT_TYPES } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Carrot, Apple, Wheat, Flower, Flower2, Sprout, Sun, ChevronRight, Droplet } from 'lucide-react-native';
import { Link } from 'expo-router';

interface Props {
  plant: Plant;
}

export default function PlantCard({ plant }: Props) {
  const plantType = PLANT_TYPES.find(t => t.id === plant.typeId);

  const getIcon = (iconName?: string) => {
    const size = 24;
    const color = '#059669';
    switch (iconName) {
      case 'Carrot': return <Carrot size={size} color={color} />;
      case 'Apple': return <Apple size={size} color={color} />;
      case 'Grass': return <Sprout size={size} color={color} />;
      case 'Wheat': return <Wheat size={size} color={color} />;
      case 'Flower': return <Flower size={size} color={color} />;
      case 'Flower2': return <Flower2 size={size} color={color} />;
      case 'Sun': return <Sun size={size} color={color} />;
      default: return <Sprout size={size} color={color} />;
    }
  };

  const getLastWateredText = () => {
    if (!plant.lastWateredDate) return 'Henüz sulanmadı';
    return formatDistanceToNow(new Date(plant.lastWateredDate), { addSuffix: true, locale: tr });
  };

  return (
    <Link href={`/plants/${plant.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
          {getIcon(plantType?.icon)}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.details}>
            {plantType?.name} • {plant.location.type} {plant.location.subType ? `(${plant.location.subType})` : ''}
          </Text>
          
          <View style={styles.statusContainer}>
            <Droplet size={12} color="#3B82F6" />
            <Text style={styles.statusText}>
              Son sulama: {getLastWateredText()}
            </Text>
          </View>
        </View>

        <ChevronRight size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  details: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#3B82F6',
    fontFamily: 'Inter_500Medium',
  },
});
