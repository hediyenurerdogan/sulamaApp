import { IrrigationAdvice, PlantType, WeatherData } from '../types';

export const calculateIrrigationAdvice = (weather: WeatherData | null, plant: PlantType): IrrigationAdvice => {
  if (!weather) {
    return {
      shouldWater: false,
      statusTitle: 'Veri Bekleniyor',
      message: 'Hava durumu verileri yükleniyor...',
      method: '-',
      color: '#9CA3AF',
      iconName: 'Loader',
    };
  }

  const { current, daily } = weather;
  const todayForecast = daily[0];
  const tomorrowForecast = daily[1];

  // 1. Yağmur Kontrolü (Kesin Red)
  const rainProbToday = todayForecast?.rainProb ?? 0;
  const rainAmountToday = todayForecast?.rainAmount ?? 0;
  const rainProbTomorrow = tomorrowForecast?.rainProb ?? 0;

  if (rainAmountToday > 3 || rainProbToday > 60) {
    return {
      shouldWater: false,
      statusTitle: 'Sulama Yapmayın',
      message: `Bugün yağış bekleniyor (%${Math.round(rainProbToday)}). Doğal sulama yeterli olacaktır.`,
      method: 'Doğal Sulama',
      color: '#3B82F6', // Mavi
      iconName: 'CloudRain',
    };
  }

  if (rainProbTomorrow > 75) {
    return {
      shouldWater: false,
      statusTitle: 'Yarına Erteleyin',
      message: 'Yarın yüksek ihtimalle yağmur yağacak. Tasarruf için bekleyebilirsiniz.',
      method: 'Beklemede Kalın',
      color: '#60A5FA', // Açık Mavi
      iconName: 'Clock',
    };
  }

  // 2. İhtiyaç Skoru Hesaplama
  let score = 50; // Baz puan

  // Sıcaklık Etkisi
  if (current.temp > 30) score += 25;
  else if (current.temp > 25) score += 10;
  else if (current.temp < 15) score -= 20;

  // Nem Etkisi (Düşük nem = yüksek buharlaşma)
  if (current.humidity < 30) score += 20;
  else if (current.humidity > 70) score -= 15;

  // Rüzgar Etkisi (Rüzgar toprağı kurutur)
  if (current.windSpeed > 20) score += 15;

  // Bitki Katsayısı
  const finalScore = score * plant.waterFactor;

  // 3. Karar ve Yöntem Belirleme
  if (finalScore > 90) {
    return {
      shouldWater: true,
      statusTitle: 'Bol Sulama Gerekli',
      message: `${plant.name} için hava çok sıcak ve kurak. Toprağın derinlemesine ıslandığından emin olun.`,
      method: 'Seyrek ama Bol (Derin Sulama)',
      color: '#EF4444', // Kırmızı/Turuncu
      iconName: 'Droplets',
    };
  } else if (finalScore > 55) {
    return {
      shouldWater: true,
      statusTitle: 'Sulama Öneriliyor',
      message: `Hava koşulları normal. ${plant.name} için standart bakımınızı yapın.`,
      method: 'Standart Sulama',
      color: '#10B981', // Yeşil
      iconName: 'Droplet',
    };
  } else {
    return {
      shouldWater: false,
      statusTitle: 'İhtiyaç Düşük',
      message: 'Toprak nemini parmağınızla kontrol edin, henüz sulamaya gerek olmayabilir.',
      method: 'Sadece Kontrol',
      color: '#F59E0B', // Sarı
      iconName: 'CheckCircle',
    };
  }
};
