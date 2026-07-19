import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../src/firebaseConfig';
import { useAuth } from '../../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddMarketItemScreen() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
    }
  };

  const handlePublish = async () => {
    if (!title || !price || !image || !user) {
      alert("Please fill all fields and select an image.");
      return;
    }

    setLoading(true);
    try {
      if (!imageBase64) throw new Error("Image data is missing.");
      const filename = `market/${user.uid}_${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
      
      // The ultimate hack: React Native's Blob polyfill crashes Firebase when passed ArrayBuffers.
      // By temporarily disabling global.Blob, Firebase is forced to bypass Blob creation 
      // and natively upload the base64 string using its own robust fallback methods.
      const originalBlob = global.Blob;
      global.Blob = undefined as any;

      try {
        await uploadString(storageRef, imageBase64, 'base64', {
          contentType: 'image/jpeg',
        });
      } finally {
        global.Blob = originalBlob;
      }

      const imageUrl = await getDownloadURL(storageRef);

      // 2. Save document
      await addDoc(collection(db, 'marketplace_items'), {
        title,
        price: parseFloat(price),
        imageUrl,
        sellerId: user.uid,
        createdAt: new Date(),
      });

      router.back();
    } catch (err: any) {
      console.error(err);
      alert('Failed to publish: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={48} color="#94a3b8" />
              <Text style={styles.placeholderText}>Add Product Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Fresh Organic Tomatoes"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 500"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <TouchableOpacity 
            style={styles.publishBtn} 
            onPress={handlePublish}
            disabled={loading}
          >
            <LinearGradient
              colors={['#16a34a', '#15803d']}
              style={styles.gradientBtn}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.publishText}>Publish Item</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 24,
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 4/3,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  publishBtn: {
    marginTop: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientBtn: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  publishText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
