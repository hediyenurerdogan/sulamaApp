import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { PlantType, PLANT_TYPES, WeatherData, GrowingArea, GROWING_AREAS } from '../types';
import { getWeatherData, getCoordinatesByCity } from '../services/weatherService';

interface AppContextType {
  selectedPlant: PlantType;
  setPlant: (plant: PlantType) => void;
  selectedArea: GrowingArea;
  setArea: (area: GrowingArea) => void;
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
  const [selectedArea, setSelectedArea] = useState<GrowingArea>(GROWING_AREAS[1]); // Default: Bahçe
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Konum Bulunuyor...');
  
  const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    // Load saved preferences
    const loadPrefs = async () => {
      const plantId = await AsyncStorage.getItem('selectedPlantId');
      const areaId = await AsyncStorage.getItem('selectedAreaId');
      
      if (plantId) {
        const plant = PLANT_TYPES.find((p) => p.id === plantId);
        if (plant) setSelectedPlant(plant);
      }
      if (areaId) {
        const area = GROWING_AREAS.find((a) => a.id === areaId);
        if (area) setSelectedArea(area);
      }
    };
    
    loadPrefs();
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

      let formattedName = 'Bilinmeyen Konum';
      
      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        // İlçe ve İl bilgisini önceliklendir
        // subregion: Genellikle İlçe (örn: Kadıköy)
        // region: Genellikle İl (örn: İstanbul)
        // city: Bazen İl yerine geçebilir
        
        const district = address.subregion || address.district;
        const city = address.region || address.city || address.subregion;

        if (district && city && district !== city) {
          formattedName = `${district}, ${city}`;
        } else if (city) {
          formattedName = city;
        } else if (district) {
          formattedName = district;
        }
      }
      
      setLocationName(formattedName);
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

  const setArea = async (area: GrowingArea) => {
    setSelectedArea(area);
    await AsyncStorage.setItem('selectedAreaId', area.id);
  };

  return (
    <AppContext.Provider value={{ 
      selectedPlant, 
      setPlant, 
      selectedArea,
      setArea,
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
