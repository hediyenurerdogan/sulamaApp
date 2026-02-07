import { IrrigationAdvice, PlantType, WeatherData, GrowingArea } from '../types';

export const calculateIrrigationAdvice = (
  weather: WeatherData | null, 
  plant: PlantType,
  area: GrowingArea
): IrrigationAdvice => {
  if (!weather) {
    return {
      shouldWater: false,
      statusTitle: 'Analiz Ediliyor',
      message: 'Hava durumu ve toprak verileri işleniyor...',
      method: '-',
      color: '#9CA3AF',
      iconName: 'Loader',
      aiAssistantMessage: 'Verilerinizi topluyorum, lütfen bekleyin.'
    };
  }

  const { current, daily } = weather;
  const todayForecast = daily[0];
  const tomorrowForecast = daily[1];

  // --- 1. YAĞMUR KONTROLÜ (Kesin Red) ---
  const rainProbToday = todayForecast?.rainProb ?? 0;
  const rainAmountToday = todayForecast?.rainAmount ?? 0;
  const rainProbTomorrow = tomorrowForecast?.rainProb ?? 0;

  // Sera istisnası: Serada yağmurun önemi yoktur, ama nem önemlidir.
  const isGreenhouse = area.id === 'greenhouse';
  const isPot = area.id === 'pot';

  if (!isGreenhouse && (rainAmountToday > 2 || rainProbToday > 50)) {
    return {
      shouldWater: false,
      statusTitle: 'Sulama Yapmayın',
      message: `Bugün %${Math.round(rainProbToday)} ihtimalle yağış var. Doğal sulama yeterli.`,
      method: 'Doğal Sulama',
      color: '#3B82F6', // Mavi
      iconName: 'CloudRain',
      savingsText: `Bugün sulama yapmayarak yaklaşık ${isPot ? '2' : '15'} litre su tasarrufu sağladınız.`,
      aiAssistantMessage: `Yağmur berekettir! ${area.name} içindeki ${plant.name}lerin için bugün doğa çalışıyor, sen dinlen.`
    };
  }

  if (!isGreenhouse && rainProbTomorrow > 70) {
    return {
      shouldWater: false,
      statusTitle: 'Yarına Erteleyin',
      message: 'Yarın yüksek yağış bekleniyor. Tasarruf için bekleyebilirsiniz.',
      method: 'Beklemede Kalın',
      color: '#60A5FA', // Açık Mavi
      iconName: 'Clock',
      savingsText: 'Erteleyerek su kaynaklarını koruyorsunuz.',
      aiAssistantMessage: `Yarın yağmur geliyor. ${plant.name}lerin biraz daha sabredebilir, acele etmeyelim.`
    };
  }

  // --- 2. İHTİYAÇ SKORU HESAPLAMA (Smart Logic) ---
  let score = 50; // Baz puan

  // Sıcaklık Etkisi
  if (current.temp > 30) score += 25;
  else if (current.temp > 25) score += 10;
  else if (current.temp < 15) score -= 20;

  // Nem Etkisi
  // Sukulentler neme karşı hassastır
  if (plant.id === 'succulent' && current.humidity > 60) score -= 30;
  else if (current.humidity < 30) score += 20;
  else if (current.humidity > 70) score -= 15;

  // Rüzgar Etkisi (Sadece dışarıdaysa)
  if (!isGreenhouse && current.windSpeed > 20) score += 15;

  // Alan Çarpanı (Saksı daha çabuk kurur)
  score = score * area.factor;

  // Bitki Katsayısı
  const finalScore = score * plant.waterFactor;

  // --- 3. KARAR VE YÖNTEM BELİRLEME ---
  
  // Sukulent Özel Mantığı
  if (plant.id === 'succulent') {
    if (finalScore > 100) {
      return {
        shouldWater: true,
        statusTitle: 'Az Miktar Su',
        message: 'Hava çok sıcak, toprağı hafifçe nemlendirin.',
        method: 'Sprey ile Sulama',
        color: '#F59E0B',
        iconName: 'Droplet',
        aiAssistantMessage: `Sukulentler suyu depolar ama bu sıcakta ${area.name} içinde biraz desteğe ihtiyaçları olabilir.`
      };
    } else {
      return {
        shouldWater: false,
        statusTitle: 'Su Vermeyin',
        message: 'Sukulentler şu anki koşullarda mutlu. Su vermek çürümeye yol açabilir.',
        method: 'Kuru Bırakın',
        color: '#10B981',
        iconName: 'Sun',
        aiAssistantMessage: `Merak etme, ${plant.name}lerin gayet iyi durumda. Su vermene gerek yok.`
      };
    }
  }

  if (finalScore > 90) {
    return {
      shouldWater: true,
      statusTitle: 'Bol Sulama Zamanı',
      message: `${area.name} toprağı hızla kuruyor. Derinlemesine sulama yapın.`,
      method: isPot ? 'Saksı Altına Kadar' : 'Derin Sulama',
      color: '#EF4444', // Kırmızı/Turuncu
      iconName: 'Droplets',
      aiAssistantMessage: `Dikkat! ${area.name} içindeki ${plant.name}lerin susamış görünüyor. İyice suladığından emin ol.`
    };
  } else if (finalScore > 55) {
    return {
      shouldWater: true,
      statusTitle: 'Sulama Öneriliyor',
      message: `Koşullar normal. ${plant.name} için standart bakımınızı yapın.`,
      method: 'Standart Sulama',
      color: '#10B981', // Yeşil
      iconName: 'Droplet',
      aiAssistantMessage: `Hava güzel. ${plant.name}lerini rutin şekilde sulayabilirsin, keyifleri yerine gelsin.`
    };
  } else {
    return {
      shouldWater: false,
      statusTitle: 'İhtiyaç Düşük',
      message: 'Toprak nemini parmağınızla kontrol edin, henüz acil bir durum yok.',
      method: 'Elle Kontrol',
      color: '#F59E0B', // Sarı
      iconName: 'CheckCircle',
      savingsText: 'Gereksiz sulamadan kaçınarak bitki köklerini korudunuz.',
      aiAssistantMessage: `Henüz erken. ${area.name} toprağını parmağınla kontrol et, nemliyse yarına bırakalım.`
    };
  }
};
