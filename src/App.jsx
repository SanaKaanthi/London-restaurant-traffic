import React, { useState, useEffect } from 'react';
import { Search, Users, Clock, MapPin, TrendingDown, TrendingUp, Loader } from 'lucide-react';

function App() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArea, setSelectedArea] = useState('covent-garden');

    // In production, this will use your Vercel domain automatically
    const API_BASE_URL = window.location.origin;

    // London area coordinates
  const areas = {
  'covent-garden': { name: 'Covent Garden', lat: 51.5119, lng: -0.1213 },
  'soho': { name: 'Soho', lat: 51.5136, lng: -0.1360 },
  'shoreditch': { name: 'Shoreditch', lat: 51.5252, lng: -0.0796 },
  'borough': { name: 'Borough Market', lat: 51.5055, lng: -0.0910 },
  'mayfair': { name: 'Mayfair', lat: 51.5088, lng: -0.1457 },
  'chelsea': { name: 'Chelsea', lat: 51.4875, lng: -0.1687 },
  'notting-hill': { name: 'Notting Hill', lat: 51.5099, lng: -0.1957 },
  'camden': { name: 'Camden Town', lat: 51.5392, lng: -0.1426 },
  'brixton': { name: 'Brixton', lat: 51.4613, lng: -0.1157 },
  'canary-wharf': { name: 'Canary Wharf', lat: 51.5054, lng: -0.0235 },
  'kings-cross': { name: 'Kings Cross', lat: 51.5308, lng: -0.1238 },
  'south-kensington': { name: 'South Kensington', lat: 51.4941, lng: -0.1737 },
  'marylebone': { name: 'Marylebone', lat: 51.5225, lng: -0.1545 },
  'hackney': { name: 'Hackney', lat: 51.5450, lng: -0.0553 },
  'greenwich': { name: 'Greenwich', lat: 51.4826, lng: -0.0077 },
  'islington': { name: 'Islington', lat: 51.5416, lng: -0.1028 },
  'clapham': { name: 'Clapham', lat: 51.4618, lng: -0.1384 },
  'hammersmith': { name: 'Hammersmith', lat: 51.4927, lng: -0.2339 },
  'wimbledon': { name: 'Wimbledon', lat: 51.4214, lng: -0.2064 },
  'richmond': { name: 'Richmond', lat: 51.4613, lng: -0.3037 },
  'holborn': { name: 'Holborn', lat: 51.5174, lng: -0.1204 },
  'fitzrovia': { name: 'Fitzrovia', lat: 51.5210, lng: -0.1375 },
  'bethnal-green': { name: 'Bethnal Green', lat: 51.5273, lng: -0.0559 },
  'dalston': { name: 'Dalston', lat: 51.5478, lng: -0.0754 },
  'peckham': { name: 'Peckham', lat: 51.4741, lng: -0.0690 },
  'stratford': { name: 'Stratford', lat: 51.5416, lng: -0.0024 },
  'walthamstow': { name: 'Walthamstow', lat: 51.5867, lng: -0.0223 },
  'ealing': { name: 'Ealing', lat: 51.5130, lng: -0.3089 },
  'fulham': { name: 'Fulham', lat: 51.4821, lng: -0.1947 },
  'putney': { name: 'Putney', lat: 51.4607, lng: -0.2167 },
  'wandsworth': { name: 'Wandsworth', lat: 51.4571, lng: -0.1910 },
  'battersea': { name: 'Battersea', lat: 51.4759, lng: -0.1680 },
  'balham': { name: 'Balham', lat: 51.4431, lng: -0.1525 },
  'tooting': { name: 'Tooting', lat: 51.4276, lng: -0.1678 },
  'croydon': { name: 'Croydon', lat: 51.3762, lng: -0.0982 },
  'elephant-castle': { name: 'Elephant & Castle', lat: 51.4946, lng: -0.1003 },
  'waterloo': { name: 'Waterloo', lat: 51.5036, lng: -0.1143 },
  'london-bridge': { name: 'London Bridge', lat: 51.5079, lng: -0.0877 },
  'liverpool-street': { name: 'Liverpool Street', lat: 51.5178, lng: -0.0823 },
  'bank': { name: 'Bank', lat: 51.5134, lng: -0.0889 },
  'whitechapel': { name: 'Whitechapel', lat: 51.5194, lng: -0.0612 },
  'spitalfields': { name: 'Spitalfields', lat: 51.5201, lng: -0.0759 },
  'clerkenwell': { name: 'Clerkenwell', lat: 51.5238, lng: -0.1039 },
  'farringdon': { name: 'Farringdon', lat: 51.5203, lng: -0.1053 },
  'angel': { name: 'Angel', lat: 51.5322, lng: -0.1058 },
  'highbury': { name: 'Highbury', lat: 51.5519, lng: -0.0970 },
  'stoke-newington': { name: 'Stoke Newington', lat: 51.5633, lng: -0.0737 },
  'kentish-town': { name: 'Kentish Town', lat: 51.5519, lng: -0.1403 },
  'hampstead': { name: 'Hampstead', lat: 51.5556, lng: -0.1778 },
  'west-end': { name: 'West End', lat: 51.5142, lng: -0.1494 },
  'piccadilly': { name: 'Piccadilly', lat: 51.5099, lng: -0.1342 },
  'leicester-square': { name: 'Leicester Square', lat: 51.5103, lng: -0.1281 },
  'trafalgar-square': { name: 'Trafalgar Square', lat: 51.5080, lng: -0.1281 },
  'westminster': { name: 'Westminster', lat: 51.4975, lng: -0.1357 },
  'victoria': { name: 'Victoria', lat: 51.4952, lng: -0.1441 },
  'pimlico': { name: 'Pimlico', lat: 51.4893, lng: -0.1335 },
  'vauxhall': { name: 'Vauxhall', lat: 51.4861, lng: -0.1253 },
  
};

    useEffect(() => {
        fetchRestaurants();
    }, [selectedArea]);

    const fetchRestaurants = async () => {
        setLoading(true);
        setError(null);

        try {
            const area = areas[selectedArea];
            const location = `${area.lat},${area.lng}`;
            
            const response = await fetch(
                `${API_BASE_URL}/api/search-restaurants?location=${location}&radius=1500`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();

            if (data.success) {
                const transformedData = data.data.map((place) => ({
                    id: place.place_id,
                    name: place.name,
                    area: area.name,
                    cuisine: place.types?.[0]?.replace('_', ' ') || 'Restaurant',
                    rating: place.rating || 0,
                    userRatings: place.user_ratings_total || 0,
                    priceLevel: place.price_level || 2,
                    currentTraffic: Math.floor(Math.random() * 100),
                    avgWait: Math.floor(Math.random() * 50) + 5,
                    trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
                    peakHours: '7-9pm',
                    address: place.vicinity
                }));

                setRestaurants(transformedData);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching restaurants:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRestaurants = restaurants.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.currentTraffic - b.currentTraffic);

    const getTrafficColor = (traffic) => {
        if (traffic < 40) return 'bg-green-500';
        if (traffic < 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getTrafficLabel = (traffic) => {
        if (traffic < 40) return 'Quiet';
        if (traffic < 70) return 'Moderate';
        return 'Busy';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-white mb-2">London Restaurant Traffic</h1>
                    <p className="text-slate-300">Find the best time to dine without the crowds</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search restaurants or cuisine..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <select
                            value={selectedArea}
                            onChange={(e) => setSelectedArea(e.target.value)}
                            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.entries(areas).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={fetchRestaurants}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Refresh'
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                        <p className="text-red-300">
                            <strong>Error:</strong> {error}
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRestaurants.map(restaurant => (
                            <div
                                key={restaurant.id}
                                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all hover:shadow-xl"
                            >
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-white mb-2">{restaurant.name}</h3>
                                    <div className="flex flex-col gap-2 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {restaurant.address}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span>⭐ {restaurant.rating.toFixed(1)}</span>
                                            <span>💰 {'£'.repeat(restaurant.priceLevel)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-300 font-medium">Current Traffic</span>
                                        <div className="flex items-center gap-2">
                                            {restaurant.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                                            {restaurant.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
                                            <span className={`font-bold ${
                                                restaurant.currentTraffic < 40 ? 'text-green-400' :
                                                restaurant.currentTraffic < 70 ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                                {getTrafficLabel(restaurant.currentTraffic)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full ${getTrafficColor(restaurant.currentTraffic)} transition-all duration-500`}
                                            style={{ width: `${restaurant.currentTraffic}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Avg Wait Time
                                        </span>
                                        <span className="font-semibold">{restaurant.avgWait} min</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Peak Hours
                                        </span>
                                        <span className="font-semibold text-right">{restaurant.peakHours}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && filteredRestaurants.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate-400 text-lg">No restaurants found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;