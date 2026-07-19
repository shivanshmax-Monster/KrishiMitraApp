import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WeatherScreen() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchWeatherData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Reverse geocode to get city name
      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode.length > 0) {
          const loc = geocode[0];
          const city = loc.city || loc.subregion || loc.region || 'Unknown Location';
          setLocationName(city);
        }
      } catch (e) {
        console.warn("Reverse geocoding failed", e);
      }

      // Fetch weather from Open-Meteo (added weathercode, daily wind speed, and 14-day forecast)
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,wind_speed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,wind_speed_10m_max&timezone=auto&forecast_days=14`);
      const data = await res.json();
      setWeatherData(data);
    } catch (err: any) {
      setErrorMsg('Failed to fetch weather: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Fetching local weather...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Ionicons name="warning-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!weatherData) return null;

  const current = weatherData.current;
  const today = weatherData.daily;

  const getWeatherInfo = (code: number, isDay: boolean = true) => {
    if (code === 0) return { text: 'Clear Sky', icon: isDay ? 'sunny' : 'moon', color: isDay ? '#fbbf24' : '#cbd5e1' };
    if ([1, 2].includes(code)) return { text: 'Partly Cloudy', icon: isDay ? 'partly-sunny' : 'cloudy-night', color: '#94a3b8' };
    if (code === 3) return { text: 'Overcast', icon: 'cloud', color: '#94a3b8' };
    if ([45, 48].includes(code)) return { text: 'Fog', icon: 'cloud', color: '#cbd5e1' };
    if ([51, 53, 55, 56, 57].includes(code)) return { text: 'Drizzle', icon: 'rainy', color: '#3b82f6' };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { text: 'Rain', icon: 'rainy', color: '#2563eb' };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { text: 'Snow', icon: 'snow', color: '#93c5fd' };
    if ([95, 96, 99].includes(code)) return { text: 'Thunderstorm', icon: 'thunderstorm', color: '#eab308' };
    return { text: 'Unknown', icon: 'partly-sunny', color: '#94a3b8' };
  };

  const isCurrentDay = selectedDayIndex === 0;
  const activeWeatherCode = isCurrentDay ? current.weathercode : today.weathercode[selectedDayIndex];
  const activeWeatherInfo = getWeatherInfo(activeWeatherCode, isCurrentDay ? current.is_day === 1 : true);
  
  const displayTemp = isCurrentDay ? current.temperature_2m : today.temperature_2m_max[selectedDayIndex];
  const displayHumidity = isCurrentDay ? `${current.relative_humidity_2m}%` : '--';
  const displayWindSpeed = isCurrentDay ? current.wind_speed_10m : today.wind_speed_10m_max[selectedDayIndex];
  const displayPrecipitation = today.precipitation_sum[selectedDayIndex];
  const displayMaxTemp = today.temperature_2m_max[selectedDayIndex];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={isCurrentDay ? (current.is_day ? ['#38bdf8', '#0284c7'] : ['#1e293b', '#0f172a']) : ['#38bdf8', '#0284c7']}
        style={styles.mainCard}
      >
        <TouchableOpacity style={styles.refreshButton} onPress={fetchWeatherData} activeOpacity={0.7}>
          <Ionicons name="refresh" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Ionicons 
          name={activeWeatherInfo.icon as any} 
          size={80} 
          color={activeWeatherInfo.color} 
        />
        <Text style={styles.temp}>{Math.round(displayTemp)}°C</Text>
        <Text style={styles.description}>{activeWeatherInfo.text}</Text>
        
        {locationName ? (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.locationText}>{locationName}</Text>
          </View>
        ) : null}
      </LinearGradient>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Ionicons name="water-outline" size={32} color="#0284c7" />
          <Text style={styles.gridValue}>{displayHumidity}</Text>
          <Text style={styles.gridLabel}>Humidity</Text>
        </View>

        <View style={styles.gridItem}>
          <Ionicons name="leaf-outline" size={32} color="#16a34a" />
          <Text style={styles.gridValue}>{displayWindSpeed} km/h</Text>
          <Text style={styles.gridLabel}>Wind Speed</Text>
        </View>

        <View style={styles.gridItem}>
          <Ionicons name="rainy-outline" size={32} color="#4f46e5" />
          <Text style={styles.gridValue}>{displayPrecipitation} mm</Text>
          <Text style={styles.gridLabel}>Precipitation</Text>
        </View>

        <View style={styles.gridItem}>
          <Ionicons name="thermometer-outline" size={32} color="#ea580c" />
          <Text style={styles.gridValue}>{Math.round(displayMaxTemp)}°C</Text>
          <Text style={styles.gridLabel}>Max Temp {isCurrentDay ? 'Today' : ''}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>14-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastScroll}>
        {today.time.map((dateStr: string, index: number) => {
          const date = new Date(dateStr);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = index === 0;
          const isSelected = index === selectedDayIndex;
          const dayWeatherInfo = getWeatherInfo(today.weathercode[index], true);
          return (
            <TouchableOpacity 
              key={dateStr} 
              activeOpacity={0.8}
              onPress={() => setSelectedDayIndex(index)}
              style={[styles.forecastCard, isSelected && styles.forecastCardActive]}
            >
              <Text style={[styles.forecastDay, isSelected && styles.forecastTextActive]}>
                {isToday ? 'Today' : dayName}
              </Text>
              <Text style={[styles.forecastDate, isSelected && styles.forecastTextActive]}>
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
              <Ionicons 
                name={dayWeatherInfo.icon as any} 
                size={32} 
                color={isSelected ? "#ffffff" : dayWeatherInfo.color} 
                style={styles.forecastIcon}
              />
              <View style={styles.forecastTemps}>
                <Text style={[styles.forecastMax, isSelected && styles.forecastTextActive]}>{Math.round(today.temperature_2m_max[index])}°</Text>
                <Text style={[styles.forecastMin, isSelected && styles.forecastTextActive]}>{Math.round(today.temperature_2m_min[index])}°</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#64748b',
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  mainCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  refreshButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  gridItem: {
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
  gridValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 16,
  },
  forecastScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  forecastCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 12,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  forecastCardActive: {
    backgroundColor: '#38bdf8',
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
  },
  forecastDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  forecastTextActive: {
    color: '#ffffff',
  },
  forecastIcon: {
    marginBottom: 12,
  },
  forecastTemps: {
    flexDirection: 'row',
    gap: 8,
  },
  forecastMax: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  forecastMin: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 2,
  },
});
