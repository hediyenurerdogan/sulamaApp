import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { usePlants } from '../../../context/PlantContext';
import PlantCard from '../../../components/PlantCard';
import { Plus, Sprout } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlantListScreen() {
  const { plants } = usePlants();
  const router = useRouter();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Sprout size={48} color="#10B981" />
      </View>
      <Text style={styles.emptyTitle}>Henüz bitki eklemedin</Text>
      <Text style={styles.emptyDesc}>
        Asistanın sana özel sulama önerileri verebilmesi için ilk bitkini ekle.
      </Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/plants/add')}
      >
        <Plus size={20} color="white" />
        <Text style={styles.addButtonText}>Bitki Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Bitkilerim</Text>
        <Link href="/plants/add" asChild>
          <TouchableOpacity style={styles.headerAddBtn}>
            <Plus size={24} color="#059669" />
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlantCard plant={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  headerAddBtn: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
