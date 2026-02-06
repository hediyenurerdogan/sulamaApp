export interface PlantType {
  id: string;
  name: string;
  description: string;
  waterFactor: number; // 1.0 = normal, >1.0 = çok su ister, <1.0 = az su ister
  icon: string; // Lucide icon name mapping
}

export interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
    windSpeed: number;
    rain?: number; // son 1 saatteki yağış (mm)
  };
  daily: Array<{
    date: string; // YYYY-MM-DD
    tempMax: number;
    tempMin: number;
    rainProb: number; // %
    rainAmount: number; // mm
    condition: string;
  }>;
}

export interface IrrigationAdvice {
  shouldWater: boolean;
  statusTitle: string;
  message: string;
  method: string; // Örn: "Az ama sık", "Seyrek ama bol"
  color: string; // Hex code
  iconName: string; // Lucide icon name
}

export const PLANT_TYPES: PlantType[] = [
  { id: 'vegetable', name: 'Sebze', description: 'Domates, Biber vb.', waterFactor: 1.2, icon: 'Carrot' },
  { id: 'fruit', name: 'Meyve Ağacı', description: 'Elma, Kiraz vb.', waterFactor: 1.0, icon: 'Apple' },
  { id: 'grass', name: 'Çim Alan', description: 'Bahçe çimleri', waterFactor: 1.5, icon: 'Grass' },
  { id: 'flower', name: 'Süs Bitkisi', description: 'Gül, Lale vb.', waterFactor: 1.1, icon: 'Flower2' },
  { id: 'succulent', name: 'Sukulent', description: 'Kaktüs vb.', waterFactor: 0.3, icon: 'Sun' },
  { id: 'grain', name: 'Tahıl', description: 'Buğday vb.', waterFactor: 0.8, icon: 'Wheat' },
];
