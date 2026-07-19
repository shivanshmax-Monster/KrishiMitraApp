import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../src/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.role !== 'admin') {
      Alert.alert('Unauthorized', 'You do not have admin access.');
      router.back();
      return;
    }
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);

      const listingsSnap = await getDocs(collection(db, 'marketplace_items'));
      const listingsData = listingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(listingsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      Alert.alert('Error', 'Failed to load admin data.');
    }
    setLoading(false);
  };

  const deleteListing = async (id: string) => {
    Alert.alert('Delete Listing', 'Are you sure you want to remove this listing?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'marketplace_items', id));
            setListings(listings.filter(item => item.id !== id));
            Alert.alert('Success', 'Listing removed.');
          } catch (error) {
            console.error('Error deleting listing:', error);
            Alert.alert('Error', 'Failed to delete listing.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Admin Panel', headerBackTitle: 'Home' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Registered Users ({users.length})</Text>
        {users.map(user => (
          <View key={user.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-circle" size={40} color="#16a34a" />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{user.name || 'No Name'}</Text>
                <Text style={styles.cardSubtitle}>{user.email}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: user.role === 'admin' ? '#4338ca' : '#16a34a' }]}>
                <Text style={styles.badgeText}>{user.role || 'user'}</Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Marketplace Listings ({listings.length})</Text>
        {listings.map(listing => (
          <View key={listing.id} style={styles.card}>
            <View style={styles.listingInfo}>
              <Text style={styles.cardTitle}>{listing.title}</Text>
              <Text style={styles.cardSubtitle}>₹{listing.price} • {listing.quantity}</Text>
              <Text style={styles.sellerText}>Seller: {listing.sellerName || listing.sellerId}</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteBtn}
              onPress={() => deleteListing(listing.id)}
            >
              <Ionicons name="trash" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  listingInfo: {
    flex: 1,
  },
  sellerText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  deleteBtn: {
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
  }
});
