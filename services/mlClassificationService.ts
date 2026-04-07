import * as ImageManipulator from 'expo-image-manipulator';
import { ImageClassificationResult } from '../types/ml';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

/**
 * 1. Görüntü Ön İşleme (Preprocessing)
 */
export const preprocessImage = async (uri: string): Promise<ImageManipulator.ImageResult> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 500 } }], // Hızlı ön analiz için daha küçük boyut
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipResult;
  } catch (error) {
    console.error("Ön işleme hatası:", error);
    throw new Error("Görüntü işlenirken bir hata oluştu.");
  }
};

/**
 * 2. Bulut Tabanlı Sınıflandırma Mantığı (Gerçek Gemini API)
 * Görselde ne olduğunu (İnsan, Hayvan, Bitki, Nesne) kesin tiplerle tespit eder.
 */
export const classifyImageCloud = async (base64Data: string): Promise<ImageClassificationResult> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
    throw new Error("API Anahtarı eksik. Lütfen .env dosyasına ekleyin.");
  }

  // Eğer web ortamından dummy data gelirse, API'yi yormamak için sahte bitki yanıtı dön
  if (base64Data === "dummy_base64_for_web") {
    return { type: 'plant', confidence: 0.99 };
  }

  try {
    const prompt = `Bu görselde ne görüyorsun? Lütfen görselin ana temasını analiz et ve AŞAĞIDAKİ JSON FORMATINDA döndür. Sadece JSON döndür, markdown kullanma.
    {
      "type": "plant" | "human" | "animal" | "other",
      "confidence": 0.95
    }
    KURALLAR:
    - Bitkiler, çiçekler, yapraklar, ağaçlar, sebzeler ve meyveler için "plant" kullan.
    - İnsanlar veya insan yüzleri/vücutları için "human" kullan.
    - Hayvanlar, böcekler, evcil hayvanlar için "animal" kullan.
    - Diğer cansız nesneler, manzaralar, mobilyalar veya belirsiz şeyler için "other" kullan.
    - Güvenilirlik puanı (confidence) 0.0 ile 1.0 arasında olmalı.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } }
          ]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Sınıflandırma servisi hatası.");

    const textResponse = data.candidates[0].content.parts[0].text;
    const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedJson) as ImageClassificationResult;

  } catch (error) {
    console.error("Sınıflandırma Hatası:", error);
    throw new Error("Görsel sınıflandırılamadı.");
  }
};
