import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Image as ImageIcon, RefreshCcw, ScanLine } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleImageSelection = (uri: string) => {
    // Her zaman zorunlu olarak gelişmiş ML korumasından (ön analizden) geçir
    router.push(`/scan/advanced?imageUri=${encodeURIComponent(uri)}`);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Galeri açılırken hata:", error);
      alert("Galeriye erişilemedi.");
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 0.7,
          base64: false 
        });
        if (photo) {
          handleImageSelection(photo.uri);
        }
      } catch (error) {
        console.error("Fotoğraf çekilirken hata:", error);
        alert("Fotoğraf çekilemedi. Lütfen tekrar deneyin.");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.iconCircle}>
          <ImageIcon size={40} color="#10B981" />
        </View>
        <Text style={styles.permissionTitle}>Web Önizlemesi</Text>
        <Text style={styles.permissionText}>
          Canlı kamera özelliği güvenlik kısıtlamaları nedeniyle web önizlemesinde kullanılamıyor. Lütfen test etmek için galeriden bir fotoğraf seçin.
        </Text>
        
        <TouchableOpacity style={styles.permissionButton} onPress={pickImage}>
          <Text style={styles.permissionButtonText}>Galeriden Seç</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.iconCircle}>
          <ScanLine size={40} color="#10B981" />
        </View>
        <Text style={styles.permissionTitle}>Kamera İzni Gerekli</Text>
        <Text style={styles.permissionText}>
          Bitkilerinizi analiz edebilmemiz için kameranıza erişim izni vermeniz gerekiyor.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        ref={cameraRef}
        animateShutter={false}
      >
        <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}>
          
          {/* Focus Frame */}
          <View style={styles.focusFrameContainer}>
            <ScanLine size={250} color="rgba(255,255,255,0.4)" strokeWidth={1} />
            <Text style={styles.instructionTextBelow}>
              Bitkiyi çerçevenin ortasına getirin
            </Text>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.sideButton} onPress={pickImage}>
              <ImageIcon size={28} color="white" />
              <Text style={styles.sideButtonText}>Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.captureButtonContainer} 
              onPress={takePicture}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonOuter}>
                <View style={[styles.captureButtonInner, isCapturing && styles.capturingInner]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideButton} onPress={toggleCameraFacing}>
              <RefreshCcw size={28} color="white" />
              <Text style={styles.sideButtonText}>Çevir</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'space-between' },
  focusFrameContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  instructionTextBelow: {
    color: 'white',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bottomControls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 30, marginBottom: 20 },
  sideButton: { alignItems: 'center', justifyContent: 'center', width: 60 },
  sideButtonText: { color: 'white', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 6 },
  captureButtonContainer: { alignItems: 'center', justifyContent: 'center' },
  captureButtonOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
  captureButtonInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'white' },
  capturingInner: { backgroundColor: '#D1D5DB', transform: [{ scale: 0.9 }] },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#F9FAFB' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  permissionTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#111827', marginBottom: 12, textAlign: 'center' },
  permissionText: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  permissionButton: { backgroundColor: '#10B981', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center' },
  permissionButtonText: { color: 'white', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
});
