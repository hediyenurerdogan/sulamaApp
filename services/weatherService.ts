import axios from 'axios';
import { WeatherData } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Şehir isminden koordinat bulma
export const getCoordinatesByCity = async (city: string) => {
  if (!API_KEY) throw new Error('API Key eksik');
  try {
    const res = await axios.get(`${GEO_URL}/direct`, {
      params: { q: city, limit: 1, appid: API_KEY },
    });
    if (res.data && res.data.length > 0) {
      return {
        lat: res.data[0].lat,
        lon: res.data[0].lon,
        name: res.data[0].name,
        country: res.data[0].country
      };
    }
    throw new Error('Şehir bulunamadı');
  } catch (error) {
    console.error('Geocoding hatası:', error);
    throw error;
  }
};

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!API_KEY) {
    console.warn('API Key eksik, mock veri dönülüyor.');
    return getMockWeatherData();
  }

  try {
    // Anlık hava durumu
    const currentRes = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'tr' },
    });

    // 5 günlük / 3 saatlik tahmin
    const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'tr' },
    });

    // Forecast verisini gün bazında grupla
    const dailyMap = new Map();
    
    forecastRes.data.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          tempMax: -100,
          tempMin: 100,
          rainProb: 0,
          rainAmount: 0,
          conditions: [],
        });
      }
      
      const dayData = dailyMap.get(date);
      dayData.tempMax = Math.max(dayData.tempMax, item.main.temp_max);
      dayData.tempMin = Math.min(dayData.tempMin, item.main.temp_min);
      dayData.rainProb = Math.max(dayData.rainProb, (item.pop || 0) * 100);
      if (item.rain && item.rain['3h']) {
        dayData.rainAmount += item.rain['3h'];
      }
      dayData.conditions.push(item.weather[0].description);
    });

    const daily = Array.from(dailyMap.entries()).map(([date, data]: any) => ({
      date,
      tempMax: data.tempMax,
      tempMin: data.tempMin,
      rainProb: data.rainProb,
      rainAmount: data.rainAmount,
      condition: data.conditions[Math.floor(data.conditions.length / 2)],
    })).slice(0, 7);

    return {
      current: {
        temp: currentRes.data.main.temp,
        feels_like: currentRes.data.main.feels_like,
        humidity: currentRes.data.main.humidity,
        description: currentRes.data.weather[0].description,
        icon: currentRes.data.weather[0].icon,
        windSpeed: currentRes.data.wind.speed,
        rain: currentRes.data.rain ? currentRes.data.rain['1h'] : 0,
      },
      daily,
    };

  } catch (error) {
    console.error('Hava durumu çekilemedi:', error);
    throw error;
  }
};

const getMockWeatherData = (): WeatherData => ({
  current: {
    temp: 24,
    feels_like: 26,
    humidity: 45,
    description: 'Parçalı Bulutlu',
    icon: '02d',
    windSpeed: 12,
    rain: 0,
  },
  daily: Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().split('T')[0],
      tempMax: 25 + Math.random() * 5,
      tempMin: 15 + Math.random() * 5,
      rainProb: i === 2 ? 80 : 10,
      rainAmount: i === 2 ? 15 : 0,
      condition: i === 2 ? 'Sağanak Yağışlı' : 'Güneşli',
    };
  }),
});
