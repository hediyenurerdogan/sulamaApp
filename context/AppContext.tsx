import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { PlantType, PLANT_TYPES, WeatherData } from '../types';
import { getWeatherData, getCoordinatesByCity } from '../services/weatherService';

interface AppContextType {
  selectedPlant: PlantType;
  setPlant: (plant: PlantType) => void;
  weather: WeatherData | null;
  loading: boolean;
  locationName: string;
  refreshWeather: () => Promise<void>;
  searchLocation: (city: string) => Promise<void>;
  useCurrentLocation: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlant, setSelectedPlant] = useState<PlantType>(PLANT_TYPES[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Konum Bulunuyor...');
  
  // Koordinatları state'de tutuyoruz ki refresh yapabilelim
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('selectedPlantId').then((id) => {
      if (id) {
        const plant = PLANT_TYPES.find((p) => p.id === id);
        if (plant) setSelectedPlant(plant);
      }
    });
    useCurrentLocation();
  }, []);

  const fetchWeatherForCoords = async (lat: number, lon: number, name?: string) => {
    setLoading(true);
    try {
      const data = await getWeatherData(lat, lon);
      setWeather(data);
      setCoords({ lat, lon });
      if (name) setLocationName(name);
    } catch (error) {
      console.error(error);
      setLocationName('Veri Alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Konum İzni Yok');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      let cityName = 'Bilinmeyen Konum';
      if (geocode && geocode.length > 0) {
        cityName = geocode[0].city || geocode[0].subregion || geocode[0].region || cityName;
      }
      
      setLocationName(cityName);
      await fetchWeatherForCoords(location.coords.latitude, location.coords.longitude);

    } catch (error) {
      console.error(error);
      setLocationName('Hata');
      setLoading(false);
    }
  };

  const searchLocation = async (city: string) => {
    setLoading(true);
    try {
      const result = await getCoordinatesByCity(city);
      await fetchWeatherForCoords(result.lat, result.lon, `${result.name}, ${result.country}`);
    } catch (error) {
      alert('Şehir bulunamadı. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  const refreshWeather = async () => {
    if (coords) {
      await fetchWeatherForCoords(coords.lat, coords.lon);
    } else {
      await useCurrentLocation();
    }
  };

  const setPlant = async (plant: PlantType) => {
    setSelectedPlant(plant);
    await AsyncStorage.setItem('selectedPlantId', plant.id);
  };

  return (
    <AppContext.Provider value={{ 
      selectedPlant, 
      setPlant, 
      weather, 
      loading, 
      locationName,
      refreshWeather,
      searchLocation,
      useCurrentLocation
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
