import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { styles } from './styles';

// API endpoint - use your backend proxy server URL
// For local development, use: http://localhost:3001
// For production, replace with your deployed server URL
const API_PROXY_URL = process.env.EXPO_PUBLIC_API_PROXY_URL || 'http://localhost:3001';

const StudySpotFinderApp = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCampus, setSelectedCampus] = useState('uw');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // Logo images - using local assets
  const campuses = {
    uw: {
      name: 'University of Washington',
      location: 'Seattle, WA',
      coords: { latitude: 47.6553, longitude: -122.3080, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      logo: require('../assets/images/uw-logo.png')
    },
    umd: {
      name: 'University of Maryland',
      location: 'College Park, MD',
      coords: { latitude: 38.9869, longitude: -76.9426, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      logo: require('../assets/images/umd-logo.png')
    }
  };

  const studySpots = {
    uw: [
      {
        id: 1,
        name: 'Suzzallo Library - Reading Room',
        description: 'Gothic-style reading room with high ceilings and natural light. Perfect for focused studying.',
        coordinate: { latitude: 47.6563, longitude: -122.3085 },
        noise: 'quiet',
        capacity: '6+ people',
        hours: '7 AM - 2 AM',
        tags: ['wifi', 'quiet', 'outlets', 'natural-light'],
      },
      {
        id: 2,
        name: 'Odegaard Library',
        description: 'Modern study spaces with group rooms and collaborative areas. Great for group work.',
        coordinate: { latitude: 47.6565, longitude: -122.3095 },
        noise: 'moderate',
        capacity: '6+ people',
        hours: '24/7',
        tags: ['wifi', 'group-rooms', 'outlets', 'cafe'],
      },
      {
        id: 3,
        name: 'Allen Library',
        description: 'Quiet floors with individual study carrels and modern facilities.',
        coordinate: { latitude: 47.6555, longitude: -122.3075 },
        noise: 'quiet',
        capacity: '6+ people',
        hours: '7 AM - 12 AM',
        tags: ['wifi', 'quiet', 'outlets', 'study-carrels'],
      },
      {
        id: 4,
        name: 'Communications Building',
        description: 'Open study areas with collaborative spaces and good wifi.',
        coordinate: { latitude: 47.6548, longitude: -122.3088 },
        noise: 'moderate',
        capacity: '6+ people',
        hours: '7 AM - 10 PM',
        tags: ['wifi', 'group-work', 'outlets', 'collaborative'],
      },
      {
        id: 5,
        name: 'HUB Study Lounge',
        description: 'Casual study space with comfortable seating and nearby food options.',
        coordinate: { latitude: 47.6557, longitude: -122.3068 },
        noise: 'lively',
        capacity: '6+ people',
        hours: '7 AM - 11 PM',
        tags: ['wifi', 'food-nearby', 'comfortable', 'social'],
      }
    ],
    umd: [
      {
        id: 6,
        name: 'McKeldin Library',
        description: 'Main library with multiple floors and collaborative study areas.',
        coordinate: { latitude: 38.9859, longitude: -76.9450 },
        noise: 'moderate',
        capacity: '6+ people',
        hours: '24/7',
        tags: ['wifi', 'group-rooms', 'outlets', 'cafe'],
      },
      {
        id: 7,
        name: 'Hornbake Library',
        description: 'Specialized collections with quiet study spaces.',
        coordinate: { latitude: 38.9876, longitude: -76.9436 },
        noise: 'quiet',
        capacity: '6+ people',
        hours: '8 AM - 12 AM',
        tags: ['wifi', 'quiet', 'outlets', 'special-collections'],
      },
    ]
  };

  const quickLocations = {
    uw: [
      { name: 'Red Square', coords: { latitude: 47.6553, longitude: -122.3080 } },
      { name: 'The Ave', coords: { latitude: 47.6615, longitude: -122.3130 } },
      { name: 'Burke Museum', coords: { latitude: 47.6560, longitude: -122.3110 } },
      { name: 'Drumheller Fountain', coords: { latitude: 47.6533, longitude: -122.3050 } },
    ],
    umd: [
      { name: 'Testudo Statue', coords: { latitude: 38.9869, longitude: -76.9426 } },
      { name: 'Memorial Chapel', coords: { latitude: 38.9881, longitude: -76.9412 } },
    ]
  };

  // Request location permissions and get user location
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for recommendations');
        return;
      }

      setLoading(true);
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setManualLat(location.coords.latitude.toString());
      setManualLng(location.coords.longitude.toString());
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Could not get location');
    }
  };

  // Get AI recommendations using Anthropic API
  const getAIRecommendations = async () => {
    const location = userLocation || (manualLat && manualLng ? {
      latitude: parseFloat(manualLat),
      longitude: parseFloat(manualLng)
    } : null);

    if (!location) {
      Alert.alert('Location Required', 'Please set your location first');
      return;
    }

    setLoading(true);

    try {
      const spots = studySpots[selectedCampus];
      const campusInfo = campuses[selectedCampus];

      const prompt = `You are an AI assistant helping students find the best study spots. Based on the user's location and preferences, recommend the top 3 study spots from this list.

User Location: ${location.latitude}, ${location.longitude}
Campus: ${campusInfo.name}

Available Study Spots:
${spots.map(spot => `
- ${spot.name}
  Location: ${spot.coordinate.latitude}, ${spot.coordinate.longitude}
  Description: ${spot.description}
  Noise Level: ${spot.noise}
  Hours: ${spot.hours}
  Amenities: ${spot.tags.join(', ')}
`).join('\n')}

Please provide:
1. Top 3 recommended spots based on proximity and quality
2. Brief reasoning for each recommendation (1-2 sentences)
3. Best times to visit each spot

Format your response as JSON:
{
  "recommendations": [
    {
      "spotName": "name",
      "reason": "why this spot",
      "bestTime": "suggested time",
      "distance": "approximate distance"
    }
  ]
}`;

      // Call our secure backend proxy instead of Anthropic directly
      const response = await fetch(`${API_PROXY_URL}/api/ai-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        const text = data.content[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const recommendations = JSON.parse(jsonMatch[0]);
          setAiRecommendations(recommendations);
        } else {
          setAiRecommendations({ raw: text });
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to get recommendations: ' + error.message);
    }
  };

  // Map View Component
  const MapViewComponent = () => {
    const [mapError, setMapError] = useState(null);

    return (
      <View style={styles.flex1}>
        {mapError ? (
          <View style={styles.mapErrorContainer}>
            <Text style={styles.mapErrorText}>⚠️ Map Error</Text>
            <Text style={styles.mapErrorSubtext}>{mapError}</Text>
            <Text style={styles.mapErrorHint}>
              Make sure Google Maps API key is configured in app.json
            </Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            provider={Platform.OS === 'ios' ? PROVIDER_GOOGLE : undefined}
            initialRegion={campuses[selectedCampus].coords}
            showsUserLocation
            showsMyLocationButton
            onMapReady={() => {
              console.log('Map loaded successfully!');
              setMapError(null);
            }}
            onError={(error) => {
              console.error('Map error:', error);
              const errorMessage = error?.nativeEvent?.message || error?.message || 'Unknown error';
              setMapError(`Failed to load map: ${errorMessage}. Check Google Maps API key and ensure Maps SDK for iOS is enabled.`);
            }}
            onDidFailToLoadMap={(error) => {
              console.error('Map failed to load:', error);
              setMapError('Google Maps failed to load. Verify: 1) API key is correct, 2) Maps SDK for iOS is enabled, 3) Bundle ID matches restrictions.');
            }}
          >
            {studySpots[selectedCampus].map(spot => (
              <Marker
                key={spot.id}
                coordinate={spot.coordinate}
                title={spot.name}
                description={spot.description}
                pinColor={spot.noise === 'quiet' ? 'green' : spot.noise === 'moderate' ? 'orange' : 'red'}
              />
            ))}
          </MapView>
        )}
      </View>
    );
  };

  // AI Picks View Component
  const AIPicksView = () => (
    <ScrollView style={styles.flex1}>
      <View style={styles.content}>
        {!aiRecommendations ? (
          <View style={styles.aiCard}>
            <Text style={styles.cardTitle}>Set Your Location</Text>
            <Text style={styles.cardDescription}>
              Tell us where you are to get personalized recommendations
            </Text>

            <View style={styles.locationCard}>
              <Text style={styles.sectionTitle}>⚲ Your Location</Text>

              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 47.6553"
                value={manualLat}
                onChangeText={setManualLat}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., -122.3080"
                value={manualLng}
                onChangeText={setManualLng}
                keyboardType="numeric"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={getAIRecommendations}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Get Recommendations</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={requestLocationPermission}
                  disabled={loading}
                >
                  <Text style={styles.buttonTextDark}>⚲ Use My Location</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.quickLocationsLabel}>Quick locations:</Text>
            <View style={styles.quickLocationButtons}>
              {quickLocations[selectedCampus].map(loc => (
                <TouchableOpacity
                  key={loc.name}
                  style={styles.quickLocationButton}
                  onPress={() => {
                    setManualLat(loc.coords.latitude.toString());
                    setManualLng(loc.coords.longitude.toString());
                  }}
                >
                  <Text style={styles.quickLocationText}>{loc.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.recommendationsTitle}>Your Personalized Recommendations</Text>
            {aiRecommendations.recommendations ? (
              aiRecommendations.recommendations.map((rec, idx) => (
                <View key={idx} style={styles.recommendationCard}>
                  <Text style={styles.recNumber}>#{idx + 1}</Text>
                  <Text style={styles.recName}>{rec.spotName}</Text>
                  <Text style={styles.recReason}>{rec.reason}</Text>
                  <Text style={styles.recDetail}>Best Time: {rec.bestTime}</Text>
                  <Text style={styles.recDetail}>Distance: {rec.distance}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.recReason}>{aiRecommendations.raw}</Text>
            )}
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => setAiRecommendations(null)}
            >
              <Text style={styles.buttonText}>Get New Recommendations</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // All Spots View Component
  const AllSpotsView = () => {
    const [filter, setFilter] = useState('all');
    const spots = studySpots[selectedCampus];
    const filteredSpots = filter === 'all' ? spots : spots.filter(s => s.noise === filter);

    return (
      <ScrollView style={styles.flex1}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>All Study Spots</Text>
          <Text style={styles.pageSubtitle}>{campuses[selectedCampus].name} - {spots.length} locations</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search study spots..."
          />

          <View style={styles.filterRow}>
            {['all', 'quiet', 'moderate', 'lively'].map(f => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  filter === f && styles.filterButtonActive,
                  f === 'quiet' && styles.filterQuiet,
                  f === 'moderate' && styles.filterModerate,
                  f === 'lively' && styles.filterLively,
                ]}
                onPress={() => setFilter(f)}
              >
                <Text style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive
                ]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredSpots.map(spot => (
            <View key={spot.id} style={styles.spotCard}>
              <Text style={styles.spotName}>{spot.name}</Text>
              <Text style={styles.spotDescription}>{spot.description}</Text>

              <View style={styles.spotBadges}>
                <View style={[styles.badge, spot.noise === 'quiet' ? styles.badgeQuiet : spot.noise === 'moderate' ? styles.badgeModerate : styles.badgeLively]}>
                  <Text style={styles.badgeText}>🔊 {spot.noise}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>👥 {spot.capacity}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>🕐 {spot.hours}</Text>
                </View>
              </View>

              <View style={styles.spotTags}>
                {spot.tags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  // Settings View Component
  const SettingsView = () => (
    <ScrollView style={styles.flex1}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageSubtitle}>Customize your experience</Text>

        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>⚲ Campus</Text>
          <Text style={styles.settingsDescription}>Select which campus you want to explore</Text>

          <TouchableOpacity
            style={[styles.campusButton, selectedCampus === 'uw' && styles.campusButtonActive]}
            onPress={() => setSelectedCampus('uw')}
          >
            <View>
              <Text style={[styles.campusName, selectedCampus === 'uw' && styles.campusNameActive]}>
                University of Washington
              </Text>
              <Text style={[styles.campusLocation, selectedCampus === 'uw' && styles.campusLocationActive]}>
                Seattle, WA
              </Text>
            </View>
            {selectedCampus === 'uw' && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.campusButton, selectedCampus === 'umd' && styles.campusButtonActive]}
            onPress={() => setSelectedCampus('umd')}
          >
            <View>
              <Text style={[styles.campusName, selectedCampus === 'umd' && styles.campusNameActive]}>
                University of Maryland
              </Text>
              <Text style={[styles.campusLocation, selectedCampus === 'umd' && styles.campusLocationActive]}>
                College Park, MD
              </Text>
            </View>
            {selectedCampus === 'umd' && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Your Location</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.locationInfoText}>
              {userLocation || (manualLat && manualLng)
                ? `Location set: ${manualLat || userLocation?.latitude}, ${manualLng || userLocation?.longitude}`
                : 'No location set. Set your location to get personalized recommendations.'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={requestLocationPermission}
          >
            <Text style={styles.buttonText}>Update Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>Study Map</Text>
          <Text style={styles.appSubtitle}>{campuses[selectedCampus].name}</Text>
        </View>
        <View style={styles.headerCenter}>
          <Image
            source={campuses[selectedCampus].logo}
            style={styles.campusLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerRight}>
          <View style={styles.spotsBadge}>
            <Text style={styles.spotsBadgeText}>{studySpots[selectedCampus].length} spots</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {activeTab === 'map' && <MapViewComponent />}
      {activeTab === 'ai-picks' && <AIPicksView />}
      {activeTab === 'all-spots' && <AllSpotsView />}
      {activeTab === 'settings' && <SettingsView />}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setActiveTab('map')}
        >
          <Text style={[styles.navIcon, activeTab === 'map' && styles.navIconActive]}>♢</Text>
          <Text style={[styles.navText, activeTab === 'map' && styles.navTextActive]}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setActiveTab('ai-picks')}
        >
          <Text style={[styles.navIcon, activeTab === 'ai-picks' && styles.navIconActive]}>☆</Text>
          <Text style={[styles.navText, activeTab === 'ai-picks' && styles.navTextActive]}>AI Picks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setActiveTab('all-spots')}
        >
          <Text style={[styles.navIcon, activeTab === 'all-spots' && styles.navIconActive]}>♡</Text>
          <Text style={[styles.navText, activeTab === 'all-spots' && styles.navTextActive]}>All Spots</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.navIcon, activeTab === 'settings' && styles.navIconActive]}>○</Text>
          <Text style={[styles.navText, activeTab === 'settings' && styles.navTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StudySpotFinderApp;
