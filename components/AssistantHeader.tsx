import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Props {
  plantCount: number;
  locationName: string;
}

export default function AssistantHeader({ plantCount, locationName }: Props) {
  const today = new Date();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ECFDF5', '#FFFFFF']}
        style={styles.background}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Sparkles size={14} color="#059669" />
            <Text style={styles.badgeText}>GÜNLÜK ANALİZ</Text>
          </View>
          <Text style={styles.dateText}>
            {format(today, 'd MMMM', { locale: tr })}
          </Text>
        </View>
        
        <Text style={styles.title}>
          Bugün <Text style={styles.highlight}>{plantCount} bitkin</Text> için analiz yapıldı.
        </Text>
        
        <Text style={styles.subtitle}>
          {locationName} bölgesindeki hava durumu ve bitki türlerine göre hazırlanan öneriler aşağıdadır.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
  },
  dateText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    lineHeight: 30,
    marginBottom: 8,
  },
  highlight: {
    color: '#059669',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
});
