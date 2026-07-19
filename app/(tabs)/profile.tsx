import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { auth, db } from '../../src/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { profile } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    
    if (profile?.uid) {
      await updateDoc(doc(db, 'users', profile.uid), {
        language: newLang
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile')}</Text>
      
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons name="person-circle-outline" size={32} color="#16a34a" />
          <View style={styles.infoText}>
            <Text style={styles.label}>{t('name')}</Text>
            <Text style={styles.value}>{profile?.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={32} color="#16a34a" />
          <View style={styles.infoText}>
            <Text style={styles.label}>{t('email')}</Text>
            <Text style={styles.value}>{profile?.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="shield-outline" size={32} color="#16a34a" />
          <View style={styles.infoText}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>{profile?.role}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.settingBtn} onPress={toggleLanguage}>
        <Ionicons name="language-outline" size={24} color="#475569" />
        <Text style={styles.settingText}>
          Change Language ({i18n.language === 'en' ? 'English' : 'हिंदी'})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoText: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  settingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
});
