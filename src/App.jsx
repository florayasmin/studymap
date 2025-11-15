import React, { useState, useEffect } from 'react';
import { MapPin, Wifi, Zap, Volume2, Clock, Navigation, X, Filter, Coffee, BookOpen, Trees, Users, Sparkles, Loader2 } from 'lucide-react';

const studySpots = [
  {
    id: 1,
    name: "Odegaard Undergraduate Library",
    type: "library",
    lat: 47.6565,
    lng: -122.3105,
    noise: "quiet",
    outlets: "many",
    wifi: "excellent",
    busyness: 65,
    hours: "24/7",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
    description: "Modern study space with collaborative areas and quiet zones",
    amenities: ["24/7 access", "Group rooms", "Printing", "Cafe nearby"]
  },
  {
    id: 2,
    name: "Suzzallo Library Reading Room",
    type: "library",
    lat: 47.6559,
    lng: -122.3084,
    noise: "silent",
    outlets: "some",
    wifi: "excellent",
    busyness: 80,
    hours: "8am-12am",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80",
    description: "Iconic Gothic reading room - perfect for deep focus",
    amenities: ["Historic architecture", "Natural light", "Individual desks"]
  },
  {
    id: 3,
    name: "Paccar Hall Atrium",
    type: "quiet",
    lat: 47.6532,
    lng: -122.3077,
    noise: "moderate",
    outlets: "many",
    wifi: "excellent",
    busyness: 45,
    hours: "7am-10pm",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    description: "Modern business school with comfortable seating",
    amenities: ["Natural light", "Lounge seating", "Whiteboards"]
  },
  {
    id: 4,
    name: "The HUB Starbucks Area",
    type: "cafe",
    lat: 47.6555,
    lng: -122.3055,
    noise: "lively",
    outlets: "some",
    wifi: "good",
    busyness: 90,
    hours: "7am-9pm",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    description: "Social study spot with coffee and food options",
    amenities: ["Coffee", "Food nearby", "Social atmosphere", "Central location"]
  },
  {
    id: 5,
    name: "Allen Library",
    type: "library",
    lat: 47.6554,
    lng: -122.3090,
    noise: "quiet",
    outlets: "many",
    wifi: "excellent",
    busyness: 55,
    hours: "8am-12am",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    description: "Large library with plenty of individual study spaces",
    amenities: ["Multiple floors", "Study rooms", "Computers available"]
  },
  {
    id: 6,
    name: "Red Square (Outdoor)",
    type: "outdoor",
    lat: 47.6565,
    lng: -122.3075,
    noise: "moderate",
    outlets: "none",
    wifi: "good",
    busyness: 30,
    hours: "Always open",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    description: "Iconic outdoor space for studying on nice days",
    amenities: ["Fresh air", "Scenic views", "Plenty of seating"]
  },
  {
    id: 7,
    name: "Mary Gates Hall Commons",
    type: "quiet",
    lat: 47.6553,
    lng: -122.3067,
    noise: "quiet",
    outlets: "many",
    wifi: "excellent",
    busyness: 50,
    hours: "7am-11pm",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    description: "Comfortable study lounges with great natural light",
    amenities: ["Collaborative spaces", "Individual desks", "Modern"]
  },
  {
    id: 8,
    name: "Communications Building Lobby",
    type: "quiet",
    lat: 47.6545,
    lng: -122.3080,
    noise: "quiet",
    outlets: "some",
    wifi: "excellent",
    busyness: 35,
    hours: "7am-10pm",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    description: "Hidden gem with comfortable seating and quiet atmosphere",
    amenities: ["Less crowded", "Comfortable chairs", "Good lighting"]
  }
];

const SpotMarker = ({ spot, isSelected, onClick, rank }) => {
  const colors = {
    library: "bg-blue-500",
    cafe: "bg-orange-500",
    outdoor: "bg-green-500",
    quiet: "bg-purple-500"
  };

  return (
    <div
      onClick={onClick}
      className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-125 z-20' : 'scale-100 hover:scale-110 z-10'
      }`}
      style={{
        left: `${((spot.lng + 122.31) / 0.02) * 100}%`,
        top: `${((47.66 - spot.lat) / 0.01) * 100}%`,
      }}
    >
      <div className="relative">
        {rank !== null && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg z-10">
            {rank}
          </div>
        )}
        <div className={`${colors[spot.type]} rounded-full p-2 shadow-lg ${isSelected ? 'animate-pulse' : ''}`}>
          <MapPin className="w-5 h-5 text-white" fill="white" />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    outlets: false,
    quiet: false,
    cafe: false,
    outdoor: false,
    library: false
  });
  const [userLocation] = useState({ lat: 47.6555, lng: -122.3075 });
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiReasoning, setAiReasoning] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);

  const filteredSpots = studySpots.filter(spot => {
    if (filters.quiet && spot.noise !== 'quiet' && spot.noise !== 'silent') return false;
    if (filters.cafe && spot.type !== 'cafe') return false;
    if (filters.outdoor && spot.type !== 'outdoor') return false;
    if (filters.library && spot.type !== 'library') return false;
    if (filters.outlets && spot.outlets === 'none') return false;
    return true;
  });

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getWalkingTime = (spot) => {
    const distance = calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng);
    return Math.round(distance / 80);
  };

  const getAIRecommendations = async () => {
    setIsLoadingAI(true);
    setShowAIPanel(true);
    
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('Anthropic API key not found. Please set VITE_ANTHROPIC_API_KEY in your .env file');
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a UW campus expert helping students find the perfect study spot.

Study spots available:
${JSON.stringify(studySpots, null, 2)}

User's current location: Red Square (${userLocation.lat}, ${userLocation.lng})
Current time: ${currentTime}
Current day: ${currentDay}
User preferences: ${JSON.stringify(filters)}

Analyze these study spots and rank them from BEST to WORST for studying right now. Consider:
1. Walking distance from user's location (closer is better)
2. Likely current busyness (consider time of day and day of week)
3. User's preferences from filters
4. Appropriate atmosphere for this time of day
5. Availability of amenities

Respond with ONLY a JSON object in this exact format (no markdown, no backticks):
{
  "rankedSpotIds": [1, 3, 7, 2, 5, 8, 4, 6],
  "topRecommendation": 1,
  "reasoning": "Brief explanation of why the top 3 spots are recommended right now"
}`
            }
          ],
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || 
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format from API');
      }

      const text = data.content[0].text.trim();
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleanText);
      
      if (!result.rankedSpotIds || !result.topRecommendation || !result.reasoning) {
        throw new Error('Invalid response structure from AI');
      }
      
      setAiRecommendations(result.rankedSpotIds);
      setAiReasoning(result.reasoning);
      
      // Auto-select top recommendation
      const topSpot = studySpots.find(s => s.id === result.topRecommendation);
      if (topSpot) {
        setSelectedSpot(topSpot);
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setAiReasoning(
        errorMessage.includes('API key') 
          ? 'API key not configured. Please set VITE_ANTHROPIC_API_KEY in your .env file.'
          : `Error: ${errorMessage}`
      );
    } finally {
      setIsLoadingAI(false);
    }
  };

  const getSpotRank = (spotId) => {
    if (aiRecommendations.length === 0) return null;
    const rank = aiRecommendations.indexOf(spotId);
    return rank >= 0 ? rank + 1 : null;
  };

  const displayedSpots = aiRecommendations.length > 0 
    ? aiRecommendations.map(id => studySpots.find(s => s.id === id)).filter(Boolean)
    : filteredSpots;

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm z-30 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              UW Study Spots
            </h1>
            <p className="text-sm text-gray-600 mt-1">AI-powered study space recommendations</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={getAIRecommendations}
              disabled={isLoadingAI}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Recommend
                </>
              )}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-20 right-6 bg-white rounded-2xl shadow-2xl p-6 z-40 w-80 animate-in slide-in-from-top-5 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filter Study Spots</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { key: 'outlets', label: 'Need Outlets', icon: Zap },
              { key: 'quiet', label: 'Quiet Spaces', icon: Volume2 },
              { key: 'cafe', label: 'Coffee Nearby', icon: Coffee },
              { key: 'library', label: 'Libraries Only', icon: BookOpen },
              { key: 'outdoor', label: 'Outdoor Spots', icon: Trees }
            ].map(({ key, label, icon: Icon }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={(e) => {
                    setFilters({ ...filters, [key]: e.target.checked });
                    setAiRecommendations([]); // Clear AI recommendations when filters change
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations Panel */}
      {showAIPanel && (
        <div className="absolute top-20 left-6 bg-white rounded-2xl shadow-2xl p-6 z-40 w-96 animate-in slide-in-from-left-5 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">AI Recommendations</h3>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {isLoadingAI ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : aiReasoning ? (
            <div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{aiReasoning}</p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Top 3 Recommendations:</h4>
                <ol className="space-y-2">
                  {aiRecommendations.slice(0, 3).map((spotId, index) => {
                    const spot = studySpots.find(s => s.id === spotId);
                    return (
                      <li key={spotId} className="flex items-center gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <button
                          onClick={() => setSelectedSpot(spot)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium text-left"
                        >
                          {spot?.name}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Click "AI Recommend" to get personalized study spot suggestions!</p>
          )}
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
              {[...Array(144)].map((_, i) => (
                <div key={i} className="border border-gray-300"></div>
              ))}
            </div>
          </div>
          
          {/* User Location */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${((userLocation.lng + 122.31) / 0.02) * 100}%`,
              top: `${((47.66 - userLocation.lat) / 0.01) * 100}%`,
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-blue-500 rounded-full p-2 shadow-lg">
                <Navigation className="w-4 h-4 text-white" fill="white" />
              </div>
            </div>
          </div>

          {/* Study Spot Markers */}
          {displayedSpots.map((spot) => (
            <SpotMarker
              key={spot.id}
              spot={spot}
              isSelected={selectedSpot?.id === spot.id}
              onClick={() => setSelectedSpot(spot)}
              rank={getSpotRank(spot.id)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20">
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Library</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Cafe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Outdoor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Quiet Space</span>
            </div>
            {aiRecommendations.length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200 mt-2">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                <span className="text-gray-600">AI Ranked</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Card */}
        {selectedSpot && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-30 animate-in slide-in-from-bottom-5 duration-300 max-h-[60vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedSpot(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              {getSpotRank(selectedSpot.id) && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg z-10 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  #{getSpotRank(selectedSpot.id)} AI Pick
                </div>
              )}
              
              <img
                src={selectedSpot.image}
                alt={selectedSpot.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedSpot.name}
                    </h2>
                    <p className="text-gray-600">{selectedSpot.description}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-900">Walk Time</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{getWalkingTime(selectedSpot)} min</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-900">Busyness</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-purple-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${selectedSpot.busyness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-purple-600">{selectedSpot.busyness}%</span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Volume2 className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-600 capitalize">{selectedSpot.noise}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Zap className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-600 capitalize">{selectedSpot.outlets}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Wifi className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-600 capitalize">{selectedSpot.wifi}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <p className="text-xs text-gray-600">{selectedSpot.hours.split('-')[0]}</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h3 className="font-semibold text-sm text-gray-900 mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpot.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;