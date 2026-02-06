import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { PLANT_TYPES, PlantType } from '../types';
import { Carrot, Apple, Wheat, Flower, Flower2, Sprout, Sun } from 'lucide-react-native';

interface Props {
  selectedPlant: PlantType;
  onSelect: (plant: PlantType) => void;
}

export default function PlantSelector({ selectedPlant, onSelect }: Props) {
  const getIcon = (iconName: string, color: string) => {
    const size = 20;
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Bitki Türü</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PLANT_TYPES.map((plant) => {
          const isSelected = selectedPlant.id === plant.id;
          return (
            <TouchableOpacity
              key={plant.id}
              style={[
                styles.item,
                isSelected && styles.selectedItem
              ]}
              onPress={() => onSelect(plant)}
            >
              {getIcon(plant.icon, isSelected ? 'white' : '#4B5563')}
              <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                {plant.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  selectedItem: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#4B5563',
  },
  selectedItemText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
  },
});
