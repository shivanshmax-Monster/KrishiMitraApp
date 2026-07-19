import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../src/firebaseConfig';

export default function DashboardScreen() {
  const { profile } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    if (profile?.uid) {
      await updateDoc(doc(db, 'users', profile.uid), { language: newLang });
    }
  };

  const services = [
    {
      id: 'weather',
      title: t('weather'),
      icon: 'partly-sunny',
      color: '#0ea5e9',
      route: '/services/weather'
    },
    {
      id: 'marketplace',
      title: t('marketplace'),
      icon: 'cart',
      color: '#f59e0b',
      route: '/services/marketplace'
    },
    {
      id: 'crop_detection',
      title: t('crop_detection'),
      icon: 'leaf',
      color: '#10b981',
      route: '/services/crop-detection'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('welcome')},</Text>
          <Text style={styles.name}>{profile?.name || 'Farmer'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
            <Text style={styles.langToggleText}>
              {i18n.language === 'en' ? 'HI' : 'EN'}
            </Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile?.name || 'F')[0].toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#16a34a', '#15803d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerCard}
        >
          <Text style={styles.bannerTitle}>KrishiMitra Services</Text>
          <Text style={styles.bannerSubtitle}>Everything you need to grow better, in one place.</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Our Services</Text>
        
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity 
              key={service.id} 
              style={styles.serviceCard}
              activeOpacity={0.8}
              onPress={() => router.push(service.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${service.color}15` }]}>
                <Ionicons name={service.icon as any} size={32} color={service.color} />
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {profile?.role === 'admin' && (
          <TouchableOpacity 
            style={styles.adminCard}
            onPress={() => router.push('/admin')}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark" size={24} color="#6366f1" />
            <Text style={styles.adminTitle}>{t('admin_panel')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  greeting: {
    color: '#64748b',
    fontSize: 16,
  },
  name: {
    color: '#1e293b',
    fontSize: 26,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langToggle: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langToggleText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  bannerCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: '#dcfce3',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'center',
  },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    justifyContent: 'center',
    gap: 8,
  },
  adminTitle: {
    color: '#4338ca',
    fontWeight: '600',
    fontSize: 16,
  },
});
