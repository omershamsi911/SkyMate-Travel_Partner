import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Search } from 'lucide-react';

interface HeroSectionProps {
  searchFrom: string;
  setSearchFrom: (value: string) => void;
  searchTo: string;
  setSearchTo: (value: string) => void;
  departDate: string;
  setDepartDate: (value: string) => void;
  returnDate: string;
  setReturnDate: (value: string) => void;
  currentColorIndex: number;
  textColors: string[];
  onSearchClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  searchFrom,
  setSearchFrom,
  searchTo,
  setSearchTo,
  departDate,
  setDepartDate,
  returnDate,
  setReturnDate,
  currentColorIndex,
  textColors,
  onSearchClick
}) => {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Journey Begins with{' '}
            <motion.span
              className={`${textColors[currentColorIndex]} transition-colors duration-500`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SkyMate
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Discover the world with intelligent flight booking, personalized recommendations, 
            and seamless travel planning all in one beautiful platform.
          </motion.p>
        </motion.div>

        {/* Flight Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-16 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="From"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="To"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-green-400" />
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-yellow-400" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSearchClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Flights</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
