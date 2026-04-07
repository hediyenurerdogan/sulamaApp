import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AdvancedImageClassifier from '../../../components/AdvancedImageClassifier';
import { AlertCircle, ArrowLeft } from 'lucide-react-native';

export default function AdvancedScanScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();

  // Hata ayıklama için konsol günlüğü
  useEffect(() => {
    console.log("[DEBUG] AdvancedScanScreen yüklendi. Gelen URI:", imageUri);
  }, [imageUri]);

  // Eğer URI gelmediyse boş ekran (null) yerine kullanıcı dostu bir hata gösteriyoruz
  if (!imageUri) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Görüntü Bulunamadı</Text>
        <Text style={styles.errorText}>
          Kamera veya galeriden seçilen görüntü işlenirken bir sorun oluştu. Lütfen tekrar deneyin.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="white" />
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <AdvancedImageClassifier 
      imageUri={imageUri}
      onRetake={() => router.back()}
      onProceedToPlantAnalysis={(uri) => {
        // Sınıflandırma başarılıysa asıl bitki analizi ekranına yönlendir
        router.replace(`/scan/result?imageUri=${encodeURIComponent(uri)}`);
      }}
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  }
});
