import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { identifyPlant } from '../../../services/aiPlantService';
import { AIPlantIdentification } from '../../../types';
import { usePlants } from '../../../context/PlantContext';
import { ArrowLeft, Droplet, Sun, Thermometer, Wind, Sprout, Bug, Globe, Info, Plus, CheckCircle2, Activity, HeartPulse, ShieldAlert } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type TabType = 'general' | 'care' | 'health';

export default function ScanResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();
  const { addPlant } = usePlants();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIPlantIdentification | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');

  useEffect(() => {
    if (imageUri) {
      identifyPlant(imageUri)
        .then((data) => {
          setResult(data);
          setError(null);
        })
        .catch((err) => {
          setError(err.message || 'Bitki tanımlanırken beklenmeyen bir hata oluştu.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('Geçerli bir görüntü bulunamadı.');
      setLoading(false);
    }
  }, [imageUri]);

  const handleSavePlant = async () => {
    if (!result) return;
    
    await addPlant({
      name: result.commonName,
      typeId: 'flower',
      location: { type: 'Saksı', subType: 'Ev içi' },
      waterNeed: 'Orta',
      lastWateredDate: null,
      lastSoilChangeDate: null,
      notificationsEnabled: true,
    });
    
    setIsSaved(true);
    setTimeout(() => {
      router.replace('/plants');
    }, 1500);
  };

  const getHealthColor = (status: string) => {
    if (status === 'Sağlıklı') return '#10B981';
    if (status === 'Kritik') return '#EF4444';
    return '#F59E0B'; // İlgiye İhtiyacı Var
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={{ uri: imageUri }} style={styles.loadingImageBg} blurRadius={15} />
        <View style={styles.loadingOverlay}>
          <View style={styles.scannerAnimation}>
            <ActivityIndicator size="large" color="#10B981" />
          </View>
          <Text style={styles.loadingTitle}>Derin Analiz Yapılıyor</Text>
          <Text style={styles.loadingDesc}>Bitkinin türü, sağlık durumu ve bakım ihtiyaçları yapay zeka ile belirleniyor...</Text>
        </View>
      </View>
    );
  }

  if (error || !result) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconBg}>
          <Info size={40} color="#EF4444" />
        </View>
        <Text style={styles.errorTitle}>Analiz Başarısız</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="white" />
          <Text style={styles.backButtonText}>Kameraya Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[1]}>
        
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: imageUri }} style={styles.heroImage} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient} />
          <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.heroContent}>
            <View style={styles.matchBadge}>
              <CheckCircle2 size={14} color="#10B981" />
              <Text style={styles.matchText}>% {result.confidenceScore} Eşleşme Doğruluğu</Text>
            </View>
            <Text style={styles.commonName}>{result.commonName}</Text>
            <Text style={styles.scientificName}>{result.scientificName}</Text>
          </View>
        </View>

        {/* Sticky Tab Bar */}
        <View style={styles.tabBarContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
            <TabButton 
              active={activeTab === 'general'} 
              title="Genel Bilgi" 
              icon={<Info size={16} color={activeTab === 'general' ? '#10B981' : '#6B7280'} />} 
              onPress={() => setActiveTab('general')} 
            />
            <TabButton 
              active={activeTab === 'care'} 
              title="Bakım" 
              icon={<Sprout size={16} color={activeTab === 'care' ? '#10B981' : '#6B7280'} />} 
              onPress={() => setActiveTab('care')} 
            />
            <TabButton 
              active={activeTab === 'health'} 
              title="Sağlık & Teşhis" 
              icon={<Activity size={16} color={activeTab === 'health' ? '#10B981' : '#6B7280'} />} 
              onPress={() => setActiveTab('health')} 
            />
          </ScrollView>
        </View>

        <View style={styles.body}>
          
          {/* TAB 1: GENEL BİLGİ */}
          {activeTab === 'general' && (
            <View style={styles.tabContent}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bitki Hakkında</Text>
                <Text style={styles.description}>{result.description}</Text>
                <Text style={styles.pronunciation}>Okunuşu: {result.pronunciation}</Text>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Globe size={20} color="#6366F1" />
                  <Text style={styles.sectionTitleRow}>Köken ve İlginç Bilgiler</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.originLabel}>Anavatanı:</Text>
                  <Text style={styles.originText}>{result.origin}</Text>
                  <View style={styles.divider} />
                  {result.uniqueFacts.map((fact, index) => (
                    <View key={index} style={styles.factItem}>
                      <View style={styles.bulletPointBlue} />
                      <Text style={styles.factText}>{fact}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: BAKIM */}
          {activeTab === 'care' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>İdeal Büyüme Koşulları</Text>
              <View style={styles.careGrid}>
                <CareCard icon={<Droplet size={22} color="#3B82F6" />} title="Sulama" desc={result.careInstructions.watering} bgColor="#EFF6FF" />
                <CareCard icon={<Sun size={22} color="#F59E0B" />} title="Işık" desc={result.careInstructions.light} bgColor="#FFFBEB" />
                <CareCard icon={<Thermometer size={22} color="#EF4444" />} title="Sıcaklık" desc={result.careInstructions.temperature} bgColor="#FEF2F2" />
                <CareCard icon={<Wind size={22} color="#8B5CF6" />} title="Nem" desc={result.careInstructions.humidity} bgColor="#F5F3FF" />
                <CareCard icon={<Sprout size={22} color="#10B981" />} title="Toprak" desc={result.careInstructions.soil} bgColor="#ECFDF5" fullWidth />
              </View>
            </View>
          )}

          {/* TAB 3: SAĞLIK VE TEŞHİS */}
          {activeTab === 'health' && (
            <View style={styles.tabContent}>
              {/* Health Status Badge */}
              <View style={[styles.healthStatusCard, { borderColor: getHealthColor(result.healthStatus) + '40', backgroundColor: getHealthColor(result.healthStatus) + '10' }]}>
                <HeartPulse size={28} color={getHealthColor(result.healthStatus)} />
                <View style={styles.healthStatusTextContainer}>
                  <Text style={styles.healthStatusLabel}>Genel Sağlık Durumu</Text>
                  <Text style={[styles.healthStatusValue, { color: getHealthColor(result.healthStatus) }]}>{result.healthStatus}</Text>
                </View>
              </View>

              {/* Disease Symptoms */}
              {result.diseaseSymptoms.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeaderRow}>
                    <ShieldAlert size={20} color="#EF4444" />
                    <Text style={styles.sectionTitleRow}>Tespit Edilen Belirtiler</Text>
                  </View>
                  <View style={styles.listContainer}>
                    {result.diseaseSymptoms.map((item, index) => (
                      <View key={index} style={styles.listItem}>
                        <View style={[styles.bulletPoint, { backgroundColor: '#EF4444' }]} />
                        <Text style={styles.listItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Treatment Advice */}
              {result.treatmentAdvice.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeaderRow}>
                    <CheckCircle2 size={20} color="#10B981" />
                    <Text style={styles.sectionTitleRow}>Tedavi ve Öneriler</Text>
                  </View>
                  <View style={styles.listContainer}>
                    {result.treatmentAdvice.map((item, index) => (
                      <View key={index} style={styles.listItem}>
                        <View style={[styles.bulletPoint, { backgroundColor: '#10B981' }]} />
                        <Text style={styles.listItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Pests & Diseases (General) */}
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Bug size={20} color="#F97316" />
                  <Text style={styles.sectionTitleRow}>Potansiyel Zararlılar</Text>
                </View>
                <View style={styles.listContainer}>
                  {result.pestsAndDiseases.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                      <View style={[styles.bulletPoint, { backgroundColor: '#F97316' }]} />
                      <Text style={styles.listItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

            </View>
          )}

        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={[styles.fab, isSaved && styles.fabSaved]} 
          onPress={handleSavePlant}
          disabled={isSaved}
        >
          {isSaved ? (
            <>
              <CheckCircle2 size={20} color="white" />
              <Text style={styles.fabText}>Bitkilerime Eklendi!</Text>
            </>
          ) : (
            <>
              <Plus size={20} color="white" />
              <Text style={styles.fabText}>Bitkilerime Ekle</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper Components
const TabButton = ({ active, title, icon, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.tabButton, active && styles.tabButtonActive]} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon}
    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{title}</Text>
  </TouchableOpacity>
);

const CareCard = ({ icon, title, desc, bgColor, fullWidth = false }: any) => (
  <View style={[styles.careCard, fullWidth && styles.careCardFull, { backgroundColor: bgColor }]}>
    <View style={styles.careHeader}>
      {icon}
      <Text style={styles.careTitle}>{title}</Text>
    </View>
    <Text style={styles.careDesc}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, backgroundColor: '#111827' },
  loadingImageBg: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
  loadingOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: 'rgba(0,0,0,0.5)' },
  scannerAnimation: { width: 80, height: 80, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#10B981', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 10 },
  loadingTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: 'white', marginBottom: 12, textAlign: 'center' },
  loadingDesc: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#D1D5DB', textAlign: 'center', lineHeight: 22 },
  
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#F9FAFB' },
  errorIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  errorTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#111827', marginBottom: 12 },
  errorText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#6B7280', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  backButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16, gap: 8 },
  backButtonText: { color: 'white', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  
  heroContainer: { height: 320, position: 'relative' },
  heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  headerBackBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: 30 },
  matchBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 6, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.5)' },
  matchText: { color: '#34D399', fontSize: 12, fontFamily: 'Inter_700Bold' },
  commonName: { fontSize: 32, fontFamily: 'Inter_700Bold', color: 'white', marginBottom: 4 },
  scientificName: { fontSize: 18, fontFamily: 'Inter_500Medium', color: '#D1D5DB', fontStyle: 'italic' },
  
  tabBarContainer: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3, zIndex: 10 },
  tabBar: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  tabButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F3F4F6', gap: 6 },
  tabButtonActive: { backgroundColor: '#ECFDF5' },
  tabButtonText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#6B7280' },
  tabButtonTextActive: { color: '#10B981' },

  body: { padding: 24, backgroundColor: '#F9FAFB' },
  tabContent: { flex: 1 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#111827', marginBottom: 16 },
  description: { fontSize: 16, fontFamily: 'Inter_400Regular', color: '#374151', lineHeight: 24, marginBottom: 12 },
  pronunciation: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#6B7280', fontStyle: 'italic' },
  
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  sectionTitleRow: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#111827' },
  
  careGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  careCard: { width: '48%', padding: 16, borderRadius: 16 },
  careCardFull: { width: '100%' },
  careHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  careTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#1F2937' },
  careDesc: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#4B5563', lineHeight: 18 },
  
  listContainer: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, marginTop: 8, marginRight: 12 },
  bulletPointBlue: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6', marginTop: 8, marginRight: 12 },
  listItemText: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium', color: '#4B5563', lineHeight: 22 },
  
  infoCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  originLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#6B7280', textTransform: 'uppercase', marginBottom: 4 },
  originText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#111827' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  factItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  factText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', color: '#4B5563', lineHeight: 20 },
  
  healthStatusCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 24, gap: 16 },
  healthStatusTextContainer: { flex: 1 },
  healthStatusLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#4B5563', marginBottom: 4 },
  healthStatusValue: { fontSize: 18, fontFamily: 'Inter_700Bold' },

  fabContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, backgroundColor: 'rgba(249, 250, 251, 0.9)', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  fab: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 16, gap: 8, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  fabSaved: { backgroundColor: '#059669' },
  fabText: { color: 'white', fontSize: 16, fontFamily: 'Inter_700Bold' },
});
