import * as ImageManipulator from 'expo-image-manipulator';
import { AIPlantIdentification } from '../types';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

/**
 * Gerçek Yapay Zeka Entegrasyonu (Google Gemini 2.5 Flash Vision)
 * Görseli analiz eder ve dünyadaki tüm bitkileri tanıyarak detaylı JSON formatında veri döndürür.
 */
export const identifyPlant = async (imageUri: string): Promise<AIPlantIdentification> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
    throw new Error("API Anahtarı eksik. Lütfen .env dosyasına EXPO_PUBLIC_GEMINI_API_KEY ekleyin.");
  }

  try {
    // 1. Resmi Base64 formatına çevir ve optimize et
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }], // API'ye hızlı gitmesi için boyutu optimize ediyoruz
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    const base64Data = manipResult.base64;

    if (!base64Data) {
      throw new Error("Görüntü işlenemedi.");
    }

    // 2. Yapay Zeka için kesin kurallı Prompt (İstem)
    const prompt = `Sen uzman bir botanikçi ve bitki patoloğusun. Verilen görseldeki bitkiyi analiz et ve AŞAĞIDAKİ JSON FORMATINDA, TÜRKÇE olarak yanıt ver. Sadece JSON döndür, markdown veya başka bir metin ekleme.
    {
      "commonName": "Yaygın Adı",
      "scientificName": "Bilimsel Adı",
      "pronunciation": "Okunuşu",
      "description": "Detaylı açıklama",
      "careInstructions": {
        "watering": "Sulama",
        "light": "Işık",
        "soil": "Toprak",
        "temperature": "Sıcaklık",
        "humidity": "Nem"
      },
      "pestsAndDiseases": ["Zararlı 1", "Zararlı 2"],
      "origin": "Kökeni",
      "uniqueFacts": ["İlginç bilgi 1", "İlginç bilgi 2"],
      "confidenceScore": 95.5,
      "healthStatus": "Sağlıklı", // Sadece "Sağlıklı", "İlgiye İhtiyacı Var" veya "Kritik" olabilir
      "diseaseSymptoms": ["Belirti 1"],
      "treatmentAdvice": ["Öneri 1"]
    }`;

    // 3. Gemini API'ye İstek At
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

    if (!response.ok) {
      throw new Error(data.error?.message || "Yapay zeka servisi yanıt vermedi.");
    }

    // 4. Yanıtı Ayrıştır (Parse)
    const textResponse = data.candidates[0].content.parts[0].text;
    
    // API bazen ```json ... ``` şeklinde markdown dönebilir, bunu temizliyoruz
    const cleanedJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedJson) as AIPlantIdentification;

    return parsedData;

  } catch (error: any) {
    console.error("AI Analiz Hatası:", error);
    throw new Error(error.message || "Bitki analiz edilirken bir hata oluştu.");
  }
};
