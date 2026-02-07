import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import { calculateIrrigationAdvice } from '../../utils/irrigationLogic';
import { MapPin, ChevronDown, Droplets, Wind, Thermometer, Calendar, Info, ArrowRight } from 'lucide-react-native';
import LocationDropdown from '../../components/LocationDropdown';
import PlantSelector from '../../components/PlantSelector';
import GrowingAreaSelector from '../../components/GrowingAreaSelector';
import AssistantBubble from '../../components/AssistantBubble';
import ValueIndicator from '../../components/ValueIndicator';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function HomeScreen() {
  const { weather, selectedPlant, setPlant, selectedArea, setArea, loading, refreshWeather, locationName } = useApp();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  const advice = calculateIrrigationAdvice(weather, selectedPlant, selectedArea);
  const today = new Date();

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <ActivityIndicator size="large" color="#10B981" />
      <Text style={styles.loadingText}>Toprak ve hava analiz ediliyor...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={styles.background}
      />
      
      {/* Header Area */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.locationTrigger} 
            onPress={() => setDropdownVisible(!dropdownVisible)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <MapPin size={18} color="#059669" />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>{locationName}</Text>
            <ChevronDown size={16} color="#6B7280" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <View style={styles.dateBadge}>
            <Text style={styles.dateDayName}>{format(today, 'EEEE', { locale: tr })}</Text>
            <Text style={styles.dateDayNum}>{format(today, 'd MMM', { locale: tr })}</Text>
          </View>
        </View>
      </View>

      {/* Dropdown - Absolute Positioned */}
      <LocationDropdown 
        visible={dropdownVisible} 
        onClose={() => setDropdownVisible(false)} 
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshWeather} tintColor="#10B981" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Selectors (Onboarding Style) */}
        <View style={styles.selectorsContainer}>
           <PlantSelector selectedPlant={selectedPlant} onSelect={setPlant} />
           <GrowingAreaSelector selectedArea={selectedArea} onSelect={setArea} />
        </View>

        {loading && !weather ? renderSkeleton() : (
          <>
            {/* Assistant Bubble */}
            <AssistantBubble message={advice.aiAssistantMessage} />

            {/* Smart Decision Card */}
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={advice.shouldWater ? ['#10B981', '#059669'] : [advice.color, advice.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainCard}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {advice.shouldWater ? 'SULAMA ZAMANI' : 'BEKLEMEDE KALIN'}
                    </Text>
                  </View>
                  <Info size={20} color="rgba(255,255,255,0.6)" />
                </View>

                <Text style={styles.mainTitle}>{advice.statusTitle}</Text>
                <Text style={styles.mainDesc}>{advice.message}</Text>

                <View style={styles.methodBox}>
                  <View>
                    <Text style={styles.methodLabel}>ÖNERİLEN YÖNTEM</Text>
                    <Text style={styles.methodText}>{advice.method}</Text>
                  </View>
                  {weather && weather.daily[1] && (
                    <View style={styles.forecastMini}>
                      <Text style={styles.forecastLabel}>YARIN</Text>
                      <Text style={styles.forecastText}>{Math.round(weather.daily[1].tempMax)}° / %{Math.round(weather.daily[1].rainProb)} Yağış</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
              
              <View style={[styles.cardShadow, { backgroundColor: advice.color }]} />
            </View>

            {/* Value Indicator (Savings) */}
            {advice.savingsText && <ValueIndicator text={advice.savingsText} />}

            {/* Weather Stats Grid */}
            {weather && (
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconBg, { backgroundColor: '#FEF2F2' }]}>
                    <Thermometer size={20} color="#EF4444" />
                  </View>
                  <Text style={styles.statValue}>{Math.round(weather.current.temp)}°</Text>
                  <Text style={styles.statLabel}>Sıcaklık</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.statIconBg, { backgroundColor: '#EFF6FF' }]}>
                    <Droplets size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.statValue}>%{weather.current.humidity}</Text>
                  <Text style={styles.statLabel}>Nem</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.statIconBg, { backgroundColor: '#F3F4F6' }]}>
                    <Wind size={20} color="#6B7280" />
                  </View>
                  <Text style={styles.statValue}>{weather.current.windSpeed}</Text>
                  <Text style={styles.statLabel}>Rüzgar</Text>
                </View>
              </View>
            )}
          </>
        )}
        
        {/* Bottom Padding for TabBar */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingRight: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '65%',
  },
  iconCircle: {
    backgroundColor: '#ECFDF5',
    padding: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#1F2937',
    flex: 1,
  },
  dateBadge: {
    alignItems: 'flex-end',
  },
  dateDayName: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateDayNum: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  selectorsContainer: {
    marginBottom: 10,
  },
  skeletonContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    marginTop: 10,
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontFamily: 'Inter_500Medium',
  },
  cardContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  mainCard: {
    borderRadius: 28,
    padding: 24,
    zIndex: 2,
  },
  cardShadow: {
    position: 'absolute',
    bottom: -10,
    left: 20,
    right: 20,
    height: 40,
    borderRadius: 28,
    opacity: 0.3,
    zIndex: 1,
    transform: [{ scaleX: 0.9 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: 'white',
    marginBottom: 8,
    lineHeight: 34,
  },
  mainDesc: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
    lineHeight: 22,
  },
  methodBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(255,255,255,0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  methodText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  forecastMini: {
    alignItems: 'flex-end',
  },
  forecastLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  forecastText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    backgroundColor: 'white',
    width: '31%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBg: {
    padding: 10,
    borderRadius: 14,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter_500Medium',
  },
});
