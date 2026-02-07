import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlants } from '../../../context/PlantContext';
import { PLANT_TYPES, PlantLocation, WaterNeed } from '../../../types';
import { X, Check, Carrot, Apple, Wheat, Flower, Flower2, Sprout, Sun } from 'lucide-react-native';

export default function AddPlantScreen() {
  const router = useRouter();
  const { addPlant } = usePlants();
  
  const [step, setStep] = useState(1);
  const [typeId, setTypeId] = useState('');
  const [name, setName] = useState('');
  const [locationType, setLocationType] = useState<PlantLocation['type']>('Saksı');
  const [subType, setSubType] = useState<PlantLocation['subType']>('Ev içi');
  const [waterNeed, setWaterNeed] = useState<WaterNeed>('Orta');

  const handleSave = async () => {
    if (!typeId) return;
    
    const selectedType = PLANT_TYPES.find(t => t.id === typeId);
    const finalName = name.trim() || selectedType?.name || 'Bitkim';

    await addPlant({
      name: finalName,
      typeId,
      location: { type: locationType, subType: locationType === 'Saksı' ? subType : undefined },
      waterNeed,
      lastWateredDate: null,
      lastSoilChangeDate: null,
      notificationsEnabled: true,
    });
    
    router.back();
  };

  const getIcon = (iconName: string, color: string) => {
    const size = 24;
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

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Bitkinin türü ne?</Text>
      <View style={styles.grid}>
        {PLANT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.gridItem, typeId === type.id && styles.gridItemSelected]}
            onPress={() => {
              setTypeId(type.id);
              setStep(2);
            }}
          >
            {getIcon(type.icon, typeId === type.id ? 'white' : '#4B5563')}
            <Text style={[styles.gridText, typeId === type.id && styles.gridTextSelected]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Ona bir isim ver</Text>
      <Text style={styles.stepSubtitle}>(İsteğe bağlı)</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: Salon Çiçeğim"
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
        <Text style={styles.nextButtonText}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Nerede büyüyor?</Text>
      
      <View style={styles.optionRow}>
        {['Saksı', 'Bahçe', 'Sera'].map((loc) => (
          <TouchableOpacity
            key={loc}
            style={[styles.optionBtn, locationType === loc && styles.optionBtnSelected]}
            onPress={() => setLocationType(loc as any)}
          >
            <Text style={[styles.optionText, locationType === loc && styles.optionTextSelected]}>{loc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {locationType === 'Saksı' && (
        <View style={styles.subOptionContainer}>
          <Text style={styles.subLabel}>Konum Detayı:</Text>
          <View style={styles.optionRow}>
            {['Ev içi', 'Balkon'].map((sub) => (
              <TouchableOpacity
                key={sub}
                style={[styles.subOptionBtn, subType === sub && styles.subOptionBtnSelected]}
                onPress={() => setSubType(sub as any)}
              >
                <Text style={[styles.subOptionText, subType === sub && styles.subOptionTextSelected]}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={() => setStep(4)}>
        <Text style={styles.nextButtonText}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Su ihtiyacı nasıl?</Text>
      <View style={styles.verticalList}>
        {['Az', 'Orta', 'Çok'].map((need) => (
          <TouchableOpacity
            key={need}
            style={[styles.listItem, waterNeed === need && styles.listItemSelected]}
            onPress={() => setWaterNeed(need as any)}
          >
            <Text style={[styles.listItemText, waterNeed === need && styles.listItemTextSelected]}>
              {need} Su İster
            </Text>
            {waterNeed === need && <Check size={20} color="#10B981" />}
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Bitkiyi Kaydet</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yeni Bitki Ekle</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${step * 25}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  closeBtn: {
    padding: 4,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  content: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  // Step 1 Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gridItemSelected: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  gridText: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#4B5563',
  },
  gridTextSelected: {
    color: 'white',
  },
  // Step 2 Input
  input: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
    fontFamily: 'Inter_500Medium',
  },
  nextButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  // Step 3 Options
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    marginTop: 16,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  optionBtnSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
  },
  optionTextSelected: {
    color: '#059669',
    fontFamily: 'Inter_600SemiBold',
  },
  subOptionContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  subLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: 'Inter_500Medium',
  },
  subOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subOptionBtnSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  subOptionText: {
    fontSize: 13,
    color: '#374151',
  },
  subOptionTextSelected: {
    color: 'white',
    fontFamily: 'Inter_600SemiBold',
  },
  // Step 4 List
  verticalList: {
    gap: 12,
    marginTop: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  listItemSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  listItemText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
  },
  listItemTextSelected: {
    color: '#059669',
    fontFamily: 'Inter_600SemiBold',
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
});
