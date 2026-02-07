import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant } from '../types';

interface PlantContextType {
  plants: Plant[];
  loading: boolean;
  addPlant: (plant: Omit<Plant, 'id' | 'createdAt'>) => Promise<void>;
  updatePlant: (id: string, updates: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  waterPlant: (id: string) => Promise<void>;
  changeSoil: (id: string) => Promise<void>;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      const storedPlants = await AsyncStorage.getItem('user_plants');
      if (storedPlants) {
        setPlants(JSON.parse(storedPlants));
      }
    } catch (error) {
      console.error('Bitkiler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePlants = async (newPlants: Plant[]) => {
    try {
      await AsyncStorage.setItem('user_plants', JSON.stringify(newPlants));
      setPlants(newPlants);
    } catch (error) {
      console.error('Bitkiler kaydedilirken hata:', error);
    }
  };

  const addPlant = async (plantData: Omit<Plant, 'id' | 'createdAt'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: Date.now().toString(), // Basit ID üretimi
      createdAt: new Date().toISOString(),
    };
    const updatedPlants = [newPlant, ...plants];
    await savePlants(updatedPlants);
  };

  const updatePlant = async (id: string, updates: Partial<Plant>) => {
    const updatedPlants = plants.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    await savePlants(updatedPlants);
  };

  const deletePlant = async (id: string) => {
    const updatedPlants = plants.filter(p => p.id !== id);
    await savePlants(updatedPlants);
  };

  const waterPlant = async (id: string) => {
    await updatePlant(id, { lastWateredDate: new Date().toISOString() });
  };

  const changeSoil = async (id: string) => {
    await updatePlant(id, { lastSoilChangeDate: new Date().toISOString() });
  };

  return (
    <PlantContext.Provider value={{ 
      plants, 
      loading, 
      addPlant, 
      updatePlant, 
      deletePlant,
      waterPlant,
      changeSoil
    }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (!context) throw new Error('usePlants must be used within a PlantProvider');
  return context;
};
