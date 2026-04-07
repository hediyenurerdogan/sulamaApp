import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { preprocessImage, classifyImageCloud } from '../services/mlClassificationService';
import { MLClassificationResult, ImageClassificationResult } from '../types/ml';
import { AlertCircle, CheckCircle2, RefreshCcw, ShieldAlert, XCircle } from 'lucide-react-native';

interface Props {
  imageUri: string;
  onRetake: () => void;
  onProceedToPlantAnalysis: (uri: string) => void;
}

const CONFIDENCE_THRESHOLD = 0.80; // Güvenilirlik eşiği

export default function AdvancedImageClassifier({ imageUri, onRetake, onProceedToPlantAnalysis }: Props) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<MLClassificationResult | null>(null);

  useEffect(() => {
    let isMounted = true;

    const runClassificationPipeline = async () => {
      if (!isMounted) return;
      setLoading(true);
      setResult(null);

      try {
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("İşlem zaman aşımına uğradı. Lütfen ağ bağlantınızı kontrol edip tekrar deneyin.")), 15000)
        );

        let base64Data = "";
        
        if (Platform.OS === 'web') {
          // Web ortamında Blob URI'yi Base64'e çevirme işlemi
          const response = await fetch(imageUri);
          const blob = await response.blob();
          base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]); // Sadece base64 verisini al
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else {
          // Mobil ortamda ImageManipulator kullanımı
          const processedImage = await Promise.race([
            preprocessImage(imageUri),
            timeoutPromise
          ]) as any;
          
          if (!processedImage.base64) throw new Error("Görüntü verisi alınamadı.");
          base64Data = processedImage.base64;
        }

        const prediction = await Promise.race([
          classifyImageCloud(base64Data),
          timeoutPromise
        ]) as ImageClassificationResult;

        if (!isMounted) return;

        const isConfident = prediction.confidence >= CONFIDENCE_THRESHOLD;

        setResult({
          prediction: isConfident ? prediction : null,
          isUncertain: !isConfident,
        });

      } catch (error: any) {
        if (!isMounted) return;
        setResult({
          prediction: null,
          isUncertain: false,
          error: error.message || "Sınıflandırma sırasında beklenmeyen bir hata oluştu.",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (imageUri) {
      runClassificationPipeline();
    } else {
      setResult({ prediction: null, isUncertain: false, error: "Geçerli bir görüntü bulunamadı." });
      setLoading(false);
    }

    return () => { isMounted = false; };
  }, [imageUri]);

  const prediction = result?.prediction;
  const isPlantDetected = prediction?.type === 'plant';
  const isStrictlyNotAPlant = prediction && prediction.type !== 'plant';

  if (loading) {
    return (
      <View style={styles.container}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} blurRadius={10} />
        ) : (
          <View style={styles.previewImage} />
        )}
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Ön Analiz Yapılıyor...</Text>
          <Text style={styles.loadingSubText}>Görselin bir bitki içerip içermediği doğrulanıyor.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
      
      <View style={styles.resultCard}>
        <Text style={styles.title}>Ön Analiz Sonucu</Text>
        
        {result?.error ? (
          <View style={styles.errorBox}>
            <AlertCircle size={24} color="#EF4444" />
            <Text style={styles.errorText}>{result.error}</Text>
          </View>
        ) : isStrictlyNotAPlant ? (
          // KESİN KURAL: Başarılı mesajıyla aynı görsel düzene (row) sahip hata kutusu
          <View style={styles.criticalErrorBox}>
            <XCircle size={24} color="#DC2626" />
            <View style={{flex: 1}}>
              <Text style={styles.criticalErrorTitle}>Bitki Bulunamadı</Text>
              <Text style={styles.criticalErrorText}>
                Bu bir {prediction.type === 'human' ? 'insan' : prediction.type === 'animal' ? 'hayvan' : 'nesne'} resmi. Lütfen bir bitki resmi yükleyin.
              </Text>
            </View>
          </View>
        ) : result?.isUncertain ? (
          <View style={styles.uncertainBox}>
            <ShieldAlert size={24} color="#F59E0B" />
            <View style={{flex: 1}}>
              <Text style={styles.uncertainText}>Sınıflandırma Belirsiz</Text>
              <Text style={styles.uncertainSubText}>Görsel net değil. Lütfen daha aydınlık bir fotoğraf çekin.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.successBox}>
            <CheckCircle2 size={24} color="#10B981" />
            <View style={{flex: 1}}>
              <Text style={styles.successTitle}>Bitki Doğrulandı</Text>
              <Text style={styles.successText}>Görsel detaylı analiz için uygun.</Text>
            </View>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
            <RefreshCcw size={18} color="#4B5563" />
            <Text style={styles.retakeButtonText}>Başka Görsel Seç</Text>
          </TouchableOpacity>

          {/* Sadece bitki tespit edildiyse 'Detaylı Analiz' butonunu göster */}
          {isPlantDetected && (
            <TouchableOpacity 
              style={styles.proceedButton} 
              onPress={() => onProceedToPlantAnalysis(imageUri)}
            >
              <CheckCircle2 size={18} color="white" />
              <Text style={styles.proceedButtonText}>Detaylı Analiz</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  previewImage: { flex: 1, width: '100%', resizeMode: 'cover', backgroundColor: '#1F2937' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: 'white', fontSize: 16, fontFamily: 'Inter_600SemiBold', marginTop: 16, textAlign: 'center' },
  loadingSubText: { color: '#9CA3AF', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 8, textAlign: 'center' },
  resultCard: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 20 },
  title: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#111827', marginBottom: 16 },
  
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, gap: 12, marginBottom: 20 },
  errorText: { flex: 1, color: '#991B1B', fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 20 },
  
  // Başarılı mesaj stiliyle tamamen aynı yapı (row layout, aynı padding ve font boyutları)
  criticalErrorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, gap: 12, marginBottom: 24, borderWidth: 1, borderColor: '#FECACA' },
  criticalErrorTitle: { color: '#991B1B', fontFamily: 'Inter_700Bold', fontSize: 15, marginBottom: 2 },
  criticalErrorText: { color: '#B91C1C', fontFamily: 'Inter_500Medium', fontSize: 13 },
  
  uncertainBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', padding: 16, borderRadius: 12, gap: 12, marginBottom: 24, borderWidth: 1, borderColor: '#FDE68A' },
  uncertainText: { color: '#B45309', fontFamily: 'Inter_700Bold', fontSize: 15, marginBottom: 2 },
  uncertainSubText: { color: '#92400E', fontFamily: 'Inter_500Medium', fontSize: 13 },
  
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 16, borderRadius: 12, gap: 12, marginBottom: 24, borderWidth: 1, borderColor: '#A7F3D0' },
  successTitle: { color: '#065F46', fontFamily: 'Inter_700Bold', fontSize: 15, marginBottom: 2 },
  successText: { color: '#047857', fontFamily: 'Inter_500Medium', fontSize: 13 },

  actionRow: { flexDirection: 'row', gap: 12 },
  retakeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', paddingVertical: 14, borderRadius: 12, gap: 8 },
  retakeButtonText: { color: '#4B5563', fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  proceedButton: { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 12, gap: 8 },
  proceedButtonText: { color: 'white', fontFamily: 'Inter_600SemiBold', fontSize: 15 },
});
