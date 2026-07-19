import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTranslation } from 'react-i18next';

export default function CropDetectionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t } = useTranslation();

  // ⚠️ API KEY INSERTED ⚠️
  const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";

  const pickImage = async (useCamera: boolean = false) => {
    let permissionResult;
    
    if (useCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permissionResult.granted === false) {
      alert("Permission to access camera/gallery is required!");
      return;
    }

    let pickerResult;
    if (useCamera) {
      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });
    } else {
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });
    }

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
      setImageBase64(pickerResult.assets[0].base64 || null);
      setResult(null); // Reset previous result
    }
  };

  const analyzeCrop = async () => {
    if (!imageBase64) return;
    
    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      alert("Please enter your Gemini API Key in crop-detection.tsx!");
      return;
    }

    setLoading(true);
    
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const prompt = "You are an expert agronomist. Analyze this plant leaf image. Reply strictly in JSON format without markdown. Include exactly these 4 keys: 'crop' (the name of the plant/crop), 'disease' (the health status or specific disease name), 'confidence' (e.g. '95%'), and 'action' (one sentence of specific advice or 'No action needed').";
      
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      };

      const resultPayload = await model.generateContent([prompt, imagePart]);
      const rawText = resultPayload.response.text();
      const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedResult = JSON.parse(cleanJsonStr);
      setResult(parsedResult);
      
    } catch (err: any) {
      console.error("AI Error:", err);
      alert("Failed to analyze crop. Ensure your API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <View style={styles.header}>
        <Ionicons name="scan-circle" size={48} color="#16a34a" />
        <Text style={styles.title}>{t('crop_detection')}</Text>
        <Text style={styles.subtitle}>{t('cd_subtitle')}</Text>
      </View>

      <View style={styles.imageSection}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={64} color="#cbd5e1" />
            <Text style={styles.placeholderText}>{t('cd_no_image')}</Text>
          </View>
        )}
      </View>

      {!result && !loading && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage(true)}>
            <Ionicons name="camera" size={24} color="#ffffff" />
            <Text style={styles.actionBtnText}>{t('cd_take_photo')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#3b82f6' }]} onPress={() => pickImage(false)}>
            <Ionicons name="images" size={24} color="#ffffff" />
            <Text style={styles.actionBtnText}>{t('cd_gallery')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {image && !result && !loading && (
        <TouchableOpacity style={styles.analyzeBtn} onPress={analyzeCrop}>
          <LinearGradient
            colors={['#16a34a', '#15803d']}
            style={styles.gradientBtn}
          >
            <Ionicons name="analytics" size={24} color="#ffffff" />
            <Text style={styles.analyzeText}>{t('cd_analyze')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>{t('cd_analyzing')}</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Ionicons 
              name={result.disease === 'Healthy Crop' ? "checkmark-circle" : "warning"} 
              size={32} 
              color={result.disease === 'Healthy Crop' ? "#16a34a" : "#ef4444"} 
            />
            <Text style={styles.resultTitle}>{result.disease}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t('cd_detected')}</Text>
            <Text style={styles.resultValue}>{result.crop}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t('cd_confidence')}</Text>
            <Text style={styles.resultValue}>{result.confidence}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.resultLabel}>{t('cd_action')}</Text>
          <Text style={styles.actionText}>{result.action}</Text>

          <TouchableOpacity 
            style={styles.resetBtn} 
            onPress={() => {
              setImage(null);
              setResult(null);
            }}
          >
            <Text style={styles.resetBtnText}>{t('cd_scan_another')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 24,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  imageSection: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  placeholderText: {
    marginTop: 12,
    color: '#94a3b8',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  analyzeBtn: {
    width: '100%',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
  },
  analyzeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  actionText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  resetBtn: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 16,
  },
});
