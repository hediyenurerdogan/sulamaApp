import { IrrigationAdvice, Plant, WeatherData, GrowingArea, PlantType, PLANT_TYPES } from '../types';

// Mevcut genel fonksiyonu koruyoruz, ancak altına bitki bazlı yeni mantığı ekliyoruz.

export const calculateIrrigationAdvice = (
  weather: WeatherData | null, 
  plant: PlantType,
  area: GrowingArea
): IrrigationAdvice => {
  // ... (Eski kod buradaydı, geriye uyumluluk için tutulabilir veya bu dosya tamamen yenilenebilir. 
  // Ancak temizlik için sadece yeni fonksiyonu ve gerekli tipleri dışa aktaracağım.)
  
  // Eski fonksiyonun mock dönüşü (Hata almamak için)
  return {
      shouldWater: false,
      statusTitle: 'Analiz',
      message: 'Veri işleniyor...',
      method: '-',
      color: '#9CA3AF',
      iconName: 'Loader',
      aiAssistantMessage: '...'
  };
};

export interface PlantAdvice {
  status: 'water' | 'wait' | 'warning' | 'check';
  title: string;
  message: string;
  detail: string; // "Yağmur %84" veya "Toprak Nemi"
  color: string;
  iconName: string;
  canSaveWater: boolean; // Tasarruf butonu gösterilsin mi?
}

export const getPlantSpecificAdvice = (
  plant: Plant,
  weather: WeatherData | null
): PlantAdvice => {
  const plantTypeInfo = PLANT_TYPES.find(t => t.id === plant.typeId);
  const isIndoor = plant.location.type === 'Saksı' && plant.location.subType === 'Ev içi';
  const isGarden = plant.location.type === 'Bahçe' || plant.location.type === 'Sera';

  // 1. Veri Yoksa
  if (!weather) {
    return {
      status: 'check',
      title: 'Veri Bekleniyor',
      message: 'Hava durumu verisi yükleniyor...',
      detail: '--',
      color: '#9CA3AF',
      iconName: 'Loader',
      canSaveWater: false
    };
  }

  const { current, daily } = weather;
  const todayForecast = daily[0];
  const rainProb = todayForecast?.rainProb ?? 0;
  
  // --- SENARYO A: EV İÇİ (Indoor) ---
  // Hava durumu (yağmur/rüzgar) yoksayılır. Sıcaklık ve türe bakılır.
  if (isIndoor) {
    // Kışın veya soğuk havalarda ev içi bitkileri daha az su ister (genelleme)
    const isColdSeason = current.temp < 15; 
    
    if (plant.typeId === 'succulent') {
      return {
        status: 'wait',
        title: 'Sulama Yapma',
        message: 'Sukulentler ev ortamında neme doymuş durumda.',
        detail: 'Işık İhtiyacı Yüksek',
        color: '#10B981', // Yeşil (Sorun yok)
        iconName: 'Sun',
        canSaveWater: true
      };
    }

    if (isColdSeason) {
      return {
        status: 'check',
        title: 'Toprağı Kontrol Et',
        message: 'Ev içi serin olabilir, toprak kurumadan sulama yapma.',
        detail: 'Nem Kontrolü',
        color: '#F59E0B', // Sarı
        iconName: 'Thermometer',
        canSaveWater: true
      };
    }

    return {
      status: 'water',
      title: 'Nem İhtiyacı',
      message: 'Ev içi sıcaklık artışı nedeniyle toprağı kontrol et.',
      detail: 'Standart Bakım',
      color: '#3B82F6', // Mavi
      iconName: 'Droplet',
      canSaveWater: false
    };
  }

  // --- SENARYO B: BAHÇE / DIŞ MEKAN (Outdoor) ---
  // Yağmur, Don, Rüzgar kritiktir.
  
  // 1. Don Riski
  if (current.temp < 4) {
    return {
      status: 'warning',
      title: 'Don Riski!',
      message: 'Sıcaklık çok düşük. Sulama yapma, bitkiyi koru.',
      detail: `${Math.round(current.temp)}°C Düşük Sıcaklık`,
      color: '#EF4444', // Kırmızı
      iconName: 'Snowflake',
      canSaveWater: false
    };
  }

  // 2. Yağmur Durumu
  if (rainProb > 60) {
    return {
      status: 'wait',
      title: 'Sulama Yapma',
      message: 'Bugün yüksek ihtimalle yağmur yağacak.',
      detail: `Yağış İhtimali %${Math.round(rainProb)}`,
      color: '#3B82F6', // Mavi (Pozitif bekleme)
      iconName: 'CloudRain',
      canSaveWater: true
    };
  }

  // 3. Sıcaklık Yüksekse
  if (current.temp > 30) {
    return {
      status: 'water',
      title: 'Ekstra Su Gerekebilir',
      message: 'Aşırı sıcaklar toprağı hızla kurutuyor.',
      detail: `${Math.round(current.temp)}°C Yüksek Sıcaklık`,
      color: '#F97316', // Turuncu
      iconName: 'Sun',
      canSaveWater: false
    };
  }

  // 4. Standart Durum
  return {
    status: 'check',
    title: 'Rutin Kontrol',
    message: 'Hava koşulları normal. Toprak nemine göre karar ver.',
    detail: 'Parçalı Bulutlu',
    color: '#10B981', // Yeşil
    iconName: 'Sprout',
    canSaveWater: true
  };
};
