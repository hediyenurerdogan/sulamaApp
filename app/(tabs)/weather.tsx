import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Platform } from 'react-native';
import { useApp } from '../../context/AppContext';
import { CloudRain, Sun, Cloud, CloudLightning, CalendarDays } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';

export default function WeatherScreen() {
  const { weather, loading } = useApp();

  const getWeatherIcon = (condition: string, size = 24) => {
    const cond = condition.toLowerCase();
    if (cond.includes('yağmur') || cond.includes('rain')) return <CloudRain size={size} color="#3B82F6" />;
    if (cond.includes('bulut') || cond.includes('cloud')) return <Cloud size={size} color="#9CA3AF" />;
    if (cond.includes('fırtına') || cond.includes('storm')) return <CloudLightning size={size} color="#6366F1" />;
    return <Sun size={size} color="#F59E0B" />;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#F3F4F6']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <CalendarDays size={24} color="#059669" />
        </View>
        <View>
          <Text style={styles.title}>7 Günlük Tahmin</Text>
          <Text style={styles.subtitle}>Haftalık hava durumu raporu</Text>
        </View>
      </View>
      
      <FlatList
        data={weather?.daily || []}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={[styles.card, index === 0 && styles.todayCard]}>
            <View style={styles.dateContainer}>
              <Text style={[styles.dayName, index === 0 && styles.todayText]}>
                {index === 0 ? 'Bugün' : format(parseISO(item.date), 'EEEE', { locale: tr })}
              </Text>
              <Text style={styles.date}>
                {format(parseISO(item.date), 'd MMM', { locale: tr })}
              </Text>
            </View>
            
            <View style={styles.iconContainer}>
              {getWeatherIcon(item.condition, 28)}
              <Text style={styles.conditionText} numberOfLines={1}>{item.condition}</Text>
            </View>

            <View style={styles.tempContainer}>
              <Text style={styles.maxTemp}>{Math.round(item.tempMax)}°</Text>
              <Text style={styles.minTemp}>{Math.round(item.tempMin)}°</Text>
            </View>
            
            <View style={styles.rainContainer}>
              <View style={styles.rainBadge}>
                <CloudRain size={12} color="#2563EB" />
                <Text style={styles.rainText}>%{Math.round(item.rainProb)}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconBg: {
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
  },
  listContent: {
    padding: 20,
  },
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
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  todayCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#bbf7d0',
  },
  dateContainer: {
    width: 90,
  },
  dayName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#374151',
  },
  todayText: {
    color: '#059669',
    fontFamily: 'Inter_700Bold',
  },
  date: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#9CA3AF',
    marginTop: 2,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  conditionText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textTransform: 'capitalize',
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  tempContainer: {
    width: 50,
    alignItems: 'flex-end',
  },
  maxTemp: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1F2937',
  },
  minTemp: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#9CA3AF',
  },
  rainContainer: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  rainText: {
    fontSize: 12,
    color: '#2563EB',
    fontFamily: 'Inter_600SemiBold',
  },
});
