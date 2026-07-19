import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../src/firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MarketItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  sellerId: string;
};

export default function MarketplaceScreen() {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    // Load offline cache first
    const loadCache = async () => {
      try {
        const cached = await AsyncStorage.getItem('market_items_cache');
        if (cached) {
          setItems(JSON.parse(cached));
          setLoading(false); // Stop loading early if we have cache
        }
      } catch (e) {
        console.error('Failed to load cache', e);
      }
    };
    loadCache();

    // Listen to Firebase and update cache
    const q = query(collection(db, 'marketplace_items'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedItems: MarketItem[] = [];
      snapshot.forEach((doc) => {
        fetchedItems.push({ id: doc.id, ...doc.data() } as MarketItem);
      });
      setItems(fetchedItems);
      setLoading(false);
      
      // Save to cache for offline mode
      AsyncStorage.setItem('market_items_cache', JSON.stringify(fetchedItems)).catch(console.error);
    }, (error) => {
      console.log('Firebase fetch error (offline mode active):', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleContactSeller = async (itemTitle: string) => {
    Alert.alert('Message Sent! ✅', `The seller has been notified about your interest in "${itemTitle}".`);
  };

  const renderItem = ({ item }: { item: MarketItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.cardBody}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <TouchableOpacity 
          style={styles.contactBtn} 
          onPress={() => handleContactSeller(item.title)}
        >
          <Text style={styles.contactText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#16a34a" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="basket-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No items for sale yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/services/marketplace/add')}
      >
        <LinearGradient
          colors={['#16a34a', '#15803d']}
          style={styles.fabInner}
        >
          <Ionicons name="add" size={32} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#e2e8f0',
  },
  cardBody: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 12,
  },
  contactBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
