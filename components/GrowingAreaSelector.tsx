import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { GROWING_AREAS, GrowingArea } from '../types';
import { Box, LandPlot, Warehouse } from 'lucide-react-native';

interface Props {
  selectedArea: GrowingArea;
  onSelect: (area: GrowingArea) => void;
}

export default function GrowingAreaSelector({ selectedArea, onSelect }: Props) {
  const getIcon = (iconName: string, color: string) => {
    const size = 18;
    switch (iconName) {
      case 'Box': return <Box size={size} color={color} />;
      case 'LandPlot': return <LandPlot size={size} color={color} />;
      case 'Warehouse': return <Warehouse size={size} color={color} />;
      default: return <LandPlot size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Yetiştirme Alanı</Text>
      <View style={styles.row}>
        {GROWING_AREAS.map((area) => {
          const isSelected = selectedArea.id === area.id;
          return (
            <TouchableOpacity
              key={area.id}
              style={[
                styles.item,
                isSelected && styles.selectedItem
              ]}
              onPress={() => onSelect(area)}
              activeOpacity={0.7}
            >
              {getIcon(area.icon, isSelected ? 'white' : '#4B5563')}
              <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                {area.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  row: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
    minWidth: '30%',
  },
  selectedItem: {
    backgroundColor: '#059669', // Daha koyu yeşil
    borderColor: '#059669',
  },
  itemText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#4B5563',
  },
  selectedItemText: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
  },
});
