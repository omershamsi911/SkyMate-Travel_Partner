import React, { useState} from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, DollarSign, Calendar, Plane, Trash2, Share2} from 'lucide-react';
import Navigation from '../components/Navigation';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
// import { useAuth } from '../contexts/AuthContext';

interface WishlistItem {
  id: string;
  destination: string;
  country: string;
  image: string;
  price: number;
  description: string;
  addedDate: string;
  category: 'beach' | 'city' | 'mountain' | 'cultural';
}

const WishlistPage: React.FC = () => {
  const { theme } = useTheme();
  const [wishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      destination: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500',
      price: 1200,
      description: 'Tropical paradise with beautiful beaches and rich culture',
      addedDate: '2024-01-15',
      category: 'beach'
    },
    {
      id: '2',
      destination: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500',
      price: 1800,
      description: 'Modern metropolis with traditional culture and amazing food',
      addedDate: '2024-01-10',
      category: 'city'
    },
    {
      id: '3',
      destination: 'Swiss Alps',
      country: 'Switzerland',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
      price: 2200,
      description: 'Breathtaking mountain views and world-class skiing',
      addedDate: '2024-01-05',
      category: 'mountain'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: Heart },
    { id: 'beach', name: 'Beach', icon: MapPin },
    { id: 'city', name: 'City', icon: MapPin },
    { id: 'mountain', name: 'Mountain', icon: MapPin },
    { id: 'cultural', name: 'Cultural', icon: MapPin }
  ];

  const filteredItems = wishlistItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleRemoveItem = (id: string) => {
    console.log('Removing item:', id);
  };

  const handleShareItem = (item: WishlistItem) => {
    console.log('Sharing item:', item.destination);
  };

  const handleBookNow = (item: WishlistItem) => {
    console.log('Booking trip to:', item.destination);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50'} text-white`}>
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Main Content */}
      <div className="pt-16">
        {/* Header */}
        <section className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">My Wishlist</h1>
              <p className="text-xl text-gray-300">
                Your dream destinations and travel inspiration
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        {/* Wishlist Items */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.destination}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleShareItem(item)}
                        className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold">{item.destination}</h3>
                      <p className="text-gray-300">{item.country}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-300 mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-lg font-semibold">${item.price}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">
                          Added {new Date(item.addedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBookNow(item)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Plane className="w-4 h-4" />
                      <span>Book Now</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-gray-300 mb-6">
                Start adding destinations to your wishlist to save them for later.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Explore Destinations
              </motion.button>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default WishlistPage; 