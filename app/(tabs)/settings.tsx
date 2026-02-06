import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Info, ExternalLink, Settings as SettingsIcon } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ayarlar</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Hakkında</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Info size={20} color="#4B5563" />
            <Text style={styles.rowText}>Versiyon 1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.row}
            onPress={() => Linking.openURL('https://openweathermap.org')}
          >
            <ExternalLink size={20} color="#4B5563" />
            <Text style={styles.rowText}>Hava Durumu Sağlayıcısı</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <SettingsIcon size={24} color="#059669" />
        <Text style={styles.infoText}>
          Bitki seçimi ve konum ayarlarını artık doğrudan Ana Sayfa üzerinden yapabilirsiniz.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  rowText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  infoBox: {
    backgroundColor: '#ECFDF5',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#065F46',
    fontFamily: 'Inter_500Medium',
    lineHeight: 20,
  },
});
