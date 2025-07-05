// src/pages/DestinationsPage.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Mountain, Waves, Sun, Snowflake, 
  Globe, Filter, Heart, Star, ChevronDown, ChevronUp
  // DollarSign,
  // Calendar,
  // Plane,
  // Share2,
  // ArrowRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
// import Navigation from '../components/Navigation';

// Destination data structure
interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  tags: string[];
  climate: string;
  bestTime: string;
  attractions: string[];
  travelTips: string[];
}

// Mock data for destinations
const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    description: 'Famous for its white-washed buildings, blue domes, and stunning sunsets over the caldera.',
    image: '/santorini.jpg',
    rating: 4.8,
    reviews: 1240,
    price: 1200,
    tags: ['Beach', 'Romantic', 'Luxury'],
    climate: 'Mediterranean',
    bestTime: 'April to October',
    attractions: ['Oia Village', 'Red Beach', 'Ancient Thera'],
    travelTips: ['Book sunset dinners in advance', 'Rent an ATV to explore the island']
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    description: 'Ancient capital of Japan with thousands of classical Buddhist temples, gardens, and imperial palaces.',
    image: '/kyoto.jpg',
    rating: 4.9,
    reviews: 2315,
    price: 1800,
    tags: ['Cultural', 'Historical', 'Temples'],
    climate: 'Temperate',
    bestTime: 'March to May, October to November',
    attractions: ['Fushimi Inari Shrine', 'Kinkaku-ji', 'Arashiyama Bamboo Grove'],
    travelTips: ['Try traditional kaiseki cuisine', 'Visit temples early to avoid crowds']
  },
  {
    id: '3',
    name: 'Banff National Park',
    country: 'Canada',
    continent: 'North America',
    description: 'Canada\'s oldest national park with turquoise glacial lakes, snow-capped peaks, and abundant wildlife.',
    image: '/banff.jpg',
    rating: 4.7,
    reviews: 1870,
    price: 1600,
    tags: ['Mountains', 'Nature', 'Adventure'],
    climate: 'Alpine',
    bestTime: 'June to August, December to March',
    attractions: ['Lake Louise', 'Moraine Lake', 'Banff Gondola'],
    travelTips: ['Purchase park pass in advance', 'Dress in layers for changing weather']
  },
  {
    id: '4',
    name: 'Serengeti',
    country: 'Tanzania',
    continent: 'Africa',
    description: 'Vast ecosystem with the greatest concentration of large mammals on Earth, famous for the Great Migration.',
    image: '/serengeti.jpg',
    rating: 4.9,
    reviews: 980,
    price: 2500,
    tags: ['Safari', 'Wildlife', 'Adventure'],
    climate: 'Savanna',
    bestTime: 'June to October',
    attractions: ['Great Migration', 'Ngorongoro Crater', 'Hot Air Balloon Safari'],
    travelTips: ['Bring binoculars for wildlife viewing', 'Pack neutral-colored clothing']
  },
  {
    id: '5',
    name: 'Machu Picchu',
    country: 'Peru',
    continent: 'South America',
    description: '15th-century Inca citadel situated on a mountain ridge 2,430 meters above sea level.',
    image: '/machu-picchu.jpg',
    rating: 4.9,
    reviews: 2100,
    price: 1400,
    tags: ['Historical', 'Adventure', 'Archaeological'],
    climate: 'Subtropical Highland',
    bestTime: 'May to September',
    attractions: ['Inca Trail', 'Huayna Picchu', 'Sun Gate'],
    travelTips: ['Acclimate to altitude before hiking', 'Book permits months in advance']
  },
  {
    id: '6',
    name: 'Bora Bora',
    country: 'French Polynesia',
    continent: 'Oceania',
    description: 'Small South Pacific island surrounded by turquoise lagoon and barrier reef, famous for luxury resorts.',
    image: '/bora-bora.jpg',
    rating: 4.8,
    reviews: 1450,
    price: 3200,
    tags: ['Beach', 'Luxury', 'Romantic'],
    climate: 'Tropical',
    bestTime: 'May to October',
    attractions: ['Mount Otemanu', 'Coral Gardens', 'Matira Beach'],
    travelTips: ['Try snorkeling with sharks and rays', 'Stay in an overwater bungalow']
  },
  {
    id: '7',
    name: 'Patagonia',
    country: 'Chile & Argentina',
    continent: 'South America',
    description: 'Vast region encompassing the southern end of South America with glaciers, fjords, and mountains.',
    image: '/patagonia.jpg',
    rating: 4.8,
    reviews: 1320,
    price: 1900,
    tags: ['Mountains', 'Adventure', 'Wilderness'],
    climate: 'Cold Temperate',
    bestTime: 'November to March',
    attractions: ['Torres del Paine', 'Perito Moreno Glacier', 'Fitz Roy'],
    travelTips: ['Prepare for unpredictable weather', 'Bring waterproof hiking gear']
  },
  {
    id: '8',
    name: 'Venice',
    country: 'Italy',
    continent: 'Europe',
    description: 'City built on more than 100 small islands in a lagoon in the Adriatic Sea, known for its canals.',
    image: '/venice.jpg',
    rating: 4.6,
    reviews: 2750,
    price: 1100,
    tags: ['Cultural', 'Romantic', 'Historical'],
    climate: 'Humid Subtropical',
    bestTime: 'April to June, September to October',
    attractions: ['St. Mark\'s Square', 'Grand Canal', 'Rialto Bridge'],
    travelTips: ['Get lost in the backstreets', 'Try cicchetti at local bacari']
  },
];

// Filter options
const continents = ['All', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
const climates = ['All', 'Tropical', 'Mediterranean', 'Temperate', 'Alpine', 'Savanna', 'Subtropical', 'Arctic'];
const tags = ['Beach', 'Mountains', 'Cultural', 'Historical', 'Adventure', 'Wildlife', 'Luxury', 'Romantic'];

const DestinationsPage: React.FC = () => {
  const { theme } = useTheme();
  const destinations = mockDestinations;
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(mockDestinations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedClimate, setSelectedClimate] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [sideBarOpen, setSidebarOpen] = useState(false);
  
  // Filter destinations
  useEffect(() => {
    let results = [...destinations];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    }
    
    // Apply continent filter
    if (selectedContinent !== 'All') {
      results = results.filter(dest => dest.continent === selectedContinent);
    }
    
    // Apply climate filter
    if (selectedClimate !== 'All') {
      results = results.filter(dest => dest.climate === selectedClimate);
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      results = results.filter(dest => 
        selectedTags.every(tag => dest.tags.includes(tag))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        results.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    setFilteredDestinations(results);
  }, [searchTerm, selectedContinent, selectedClimate, selectedTags, sortOption, destinations]);
  
  // Handle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedContinent('All');
    setSelectedClimate('All');
    setSelectedTags([]);
    setSortOption('popular');
  };
  
  // Open destination modal
  const openModal = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };
  
  // Close destination modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDestination(null), 300);
  };
  
  // Get climate icon
  const getClimateIcon = (climate: string) => {
    switch (climate) {
      case 'Tropical': return <Sun className="w-4 h-4" />;
      case 'Mediterranean': return <Waves className="w-4 h-4" />;
      case 'Temperate': return <Globe className="w-4 h-4" />;
      case 'Alpine': return <Mountain className="w-4 h-4" />;
      case 'Savanna': return <Sun className="w-4 h-4" />;
      case 'Subtropical': return <Globe className="w-4 h-4" />;
      case 'Arctic': return <Snowflake className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' 
      ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
      : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-100'} text-white`}>
      {/* <Navigation setSidebarOpen={setSidebarOpen}/> */}
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-slate-900/90 to-purple-900/80' 
              : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
          }`}></div>
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-[url("https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80")]'
              : 'bg-[url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80")]'
          } bg-cover bg-center opacity-30`}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10">
              Explore breathtaking destinations around the globe with our curated travel experiences
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search destinations, countries, or activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 rounded-full ${
                    theme === 'dark'
                      ? 'bg-slate-800/60 backdrop-blur-md border border-white/20'
                      : 'bg-white border border-gray-200 shadow-lg'
                  } text-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Hidden on mobile by default */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`lg:w-1/4 rounded-2xl p-6 ${
              theme === 'dark'
                ? 'bg-slate-800/60 backdrop-blur-md border border-white/20'
                : 'bg-white border border-gray-200 shadow-lg'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Filter className="mr-2" /> Filters
              </h2>
              <button 
                onClick={resetFilters}
                className={`text-sm px-3 py-1 rounded-full ${
                  theme === 'dark'
                    ? 'bg-purple-700/30 hover:bg-purple-700/50'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                } transition-colors`}
              >
                Reset All
              </button>
            </div>
            
            {/* Continent Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="mr-2" /> Continent
              </h3>
              <div className="space-y-2">
                {continents.map(continent => (
                  <button
                    key={continent}
                    onClick={() => setSelectedContinent(continent)}
                    className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedContinent === continent
                        ? theme === 'dark'
                          ? 'bg-purple-700/30 text-purple-300'
                          : 'bg-purple-100 text-purple-800'
                        : theme === 'dark'
                          ? 'hover:bg-slate-700/50'
                          : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex-1">{continent}</span>
                    {selectedContinent === continent && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Climate Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sun className="mr-2" /> Climate
              </h3>
              <div className="space-y-2">
                {climates.map(climate => (
                  <button
                    key={climate}
                    onClick={() => setSelectedClimate(climate)}
                    className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedClimate === climate
                        ? theme === 'dark'
                          ? 'bg-purple-700/30 text-purple-300'
                          : 'bg-purple-100 text-purple-800'
                        : theme === 'dark'
                          ? 'hover:bg-slate-700/50'
                          : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex-1">{climate}</span>
                    {selectedClimate === climate && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tags Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="mr-2" /> Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? theme === 'dark'
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-500 text-white'
                        : theme === 'dark'
                          ? 'bg-slate-700 hover:bg-slate-600'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sorting */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="mr-2" /> Sort By
              </h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-slate-700 border border-white/10'
                    : 'bg-gray-100 border border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </motion.div>
          
          {/* Destinations Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {filteredDestinations.length} Destinations
                {filteredDestinations.length !== mockDestinations.length && (
                  <span className="text-sm font-normal ml-2">
                    (filtered from {mockDestinations.length})
                  </span>
                )}
              </h2>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`lg:hidden flex items-center px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {showFilters ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
            
            {/* Mobile Filters - Conditionally shown */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`mb-6 rounded-2xl p-6 ${
                  theme === 'dark'
                    ? 'bg-slate-800/60 backdrop-blur-md border border-white/20'
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Continent</h3>
                    <div className="flex flex-wrap gap-2">
                      {continents.map(continent => (
                        <button
                          key={continent}
                          onClick={() => setSelectedContinent(continent)}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            selectedContinent === continent
                              ? theme === 'dark'
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-500 text-white'
                              : theme === 'dark'
                                ? 'bg-slate-700 hover:bg-slate-600'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                        >
                          {continent}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            selectedTags.includes(tag)
                              ? theme === 'dark'
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-500 text-white'
                              : theme === 'dark'
                                ? 'bg-slate-700 hover:bg-slate-600'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Results */}
            {filteredDestinations.length === 0 ? (
              <div className={`text-center py-12 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800/60 backdrop-blur-md border border-white/20'
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}>
                <Globe className="mx-auto w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold mb-2">No destinations found</h3>
                <p className="max-w-md mx-auto">
                  Try adjusting your filters or search term to find your perfect destination.
                </p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredDestinations.map((destination) => (
                    <motion.div
                      key={destination.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className={`rounded-2xl overflow-hidden cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-slate-800/60 backdrop-blur-md border border-white/20'
                          : 'bg-white border border-gray-200 shadow-md'
                      }`}
                      onClick={() => openModal(destination)}
                    >
                      <div className="relative h-48">
                        <div className={`absolute inset-0 bg-gradient-to-t ${
                          theme === 'dark' ? 'from-slate-900/80 to-transparent' : 'from-black/50 to-transparent'
                        }`}>
                        <img 
                            src={destination.image} 
                            alt={destination.name} 
                            className="w-full h-full object-cover rounded-t-2xl"
                        />
                        </div>
                        <div className={`absolute top-3 right-3 flex items-center px-2.5 py-1 rounded-full ${
                            theme === 'dark' ? 'bg-slate-800/80' : 'bg-white/90 text-gray-800'
                        } text-sm font-medium`}>
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          {destination.rating}
                          <span className="text-gray-400 ml-1">({destination.reviews})</span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <h3 className="text-xl font-bold">{destination.name}</h3>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{destination.country}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className={`mb-3 text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {destination.description.substring(0, 100)}...
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {destination.tags.map(tag => (
                            <span 
                              key={tag}
                              className={`px-2 py-1 rounded-full text-xs ${
                                theme === 'dark'
                                  ? 'bg-purple-700/30 text-purple-300'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getClimateIcon(destination.climate)}
                            <span className="ml-2 text-sm">{destination.climate}</span>
                          </div>
                          
                          <div className="text-lg font-bold">
                            ${destination.price}
                            <span className="text-sm font-normal"> / person</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Destination Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDestination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl ${
                theme === 'dark'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-gray-800'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="h-80 w-full relative">
                <img 
                  src={selectedDestination.image} 
                  alt={selectedDestination.name} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  theme === 'dark' ? 'from-slate-900/90 to-transparent' : 'from-black/50 to-transparent'
                }`}></div>
                <div className="absolute bottom-6 left-6">
                  <h2 className="text-3xl font-bold text-white">{selectedDestination.name}</h2>
                  <div className="flex items-center mt-2 text-white">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">{selectedDestination.country}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    <span>Continent: <strong>{selectedDestination.continent}</strong></span>
                  </div>
                  <div className="flex items-center">
                    {getClimateIcon(selectedDestination.climate)}
                    <span className="ml-2">Climate: <strong>{selectedDestination.climate}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Sun className="w-5 h-5 mr-2" />
                    <span>Best Time: <strong>{selectedDestination.bestTime}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 fill-current" />
                    <span>Rating: <strong>{selectedDestination.rating}</strong> ({selectedDestination.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Description</h3>
                    <p className="mb-6">{selectedDestination.description}</p>
                    
                    <h3 className="text-xl font-bold mb-4">Travel Tips</h3>
                    <ul className="space-y-3">
                      {selectedDestination.travelTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0">✓</span>
                          <span className="flex-1">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4">Top Attractions</h3>
                    <ul className="space-y-3">
                      {selectedDestination.attractions.map((attraction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-sm font-bold mr-3 mt-0.5 flex-shrink-0">{index + 1}</span>
                          <span className="flex-1">{attraction}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                            <Heart className="w-5 h-5" />
                          </div>
                          <h3 className="text-2xl font-bold">Ready for Adventure?</h3>
                        </div>
                        <p className="text-lg mb-2 text-white/90">
                          Complete packages starting from
                        </p>
                        <div className="text-3xl font-bold mb-6 flex items-baseline">
                          <span className="text-4xl">${selectedDestination.price}</span>
                          <span className="text-base ml-2 text-white/80">per person</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button className="flex-1 bg-white text-purple-600 py-4 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                            <span>Book Your Journey</span>
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </button>
                          <button className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 py-4 px-6 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 flex items-center justify-center">
                            <Heart className="mr-2 w-5 h-5" />
                            <span>Save for Later</span>
                          </button>
                        </div>
                        <p className="text-sm text-white/70 mt-4 text-center">
                          ✈️ Free cancellation • 🛡️ Travel insurance included • 📱 24/7 support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationsPage;