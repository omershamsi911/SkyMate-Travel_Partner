import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Star, Globe, Plane, Hotel, Coffee, Waves, Camera, Trophy, TrendingUp, Shield, Clock, Heart, Zap, Navigation as NavigationIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const HomePage: React.FC = () => {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const { theme } = useTheme();

  // Animated text colors
  const textColors = ['text-blue-500', 'text-purple-500', 'text-pink-500', 'text-indigo-500'];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % textColors.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    // Navigate to book flight page with search parameters
    const params = new URLSearchParams({
      from: searchFrom,
      to: searchTo,
      depart: departDate,
      return: returnDate,
      passengers: passengers
    });
    window.location.href = `/book-flight?${params.toString()}`;
  };

  const features = [
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Smart Flight Search",
      description: "AI-powered flight finder with real-time prices across 500+ airlines",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Hotel className="w-8 h-8" />,
      title: "Hotel Booking",
      description: "Exclusive deals on luxury hotels and cozy accommodations worldwide",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Restaurant Reservations",
      description: "Book tables at top-rated restaurants and hidden local gems",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Beach & Activities",
      description: "Discover pristine beaches and exciting activities at your destination",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Travel Dashboard",
      description: "Share memories, track journeys, and manage all bookings in one place",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Rewards & Badges",
      description: "Earn achievements, complete challenges, and unlock exclusive perks",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart Recommendations",
      description: "AI suggests perfect destinations based on your preferences and budget"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Best Price Guarantee",
      description: "We'll match any lower price you find within 24 hours of booking"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service in multiple languages"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Personalized Experience",
      description: "Tailored recommendations based on your travel history and preferences"
    }
  ];

  const popularDestinations = [
    {
      name: "Paris, France",
      image: "🇫🇷",
      price: "$599",
      description: "City of Love and Lights"
    },
    {
      name: "Tokyo, Japan",
      image: "🇯🇵",
      price: "$899",
      description: "Modern Metropolis Meets Tradition"
    },
    {
      name: "New York, USA",
      image: "🇺🇸",
      price: "$699",
      description: "The City That Never Sleeps"
    },
    {
      name: "London, UK",
      image: "🇬🇧",
      price: "$649",
      description: "Royal Heritage and Culture"
    },
    {
      name: "Dubai, UAE",
      image: "🇦🇪",
      price: "$799",
      description: "Luxury and Innovation"
    },
    {
      name: "Sydney, Australia",
      image: "🇦🇺",
      price: "$1099",
      description: "Harbor City Down Under"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "SkyMate made planning my European vacation effortless. The AI recommendations were spot-on!",
      avatar: "👩‍💼"
    },
    {
      name: "Ahmed Hassan",
      location: "Dubai, UAE",
      rating: 5,
      text: "Best travel platform I've used. The rewards program and challenges keep me motivated to explore more.",
      avatar: "👨‍💻"
    },
    {
      name: "Maria Garcia",
      location: "Barcelona, Spain",
      rating: 5,
      text: "Love the personal dashboard feature. Sharing my travel memories with the community is amazing!",
      avatar: "👩‍🎨"
    }
  ];

  const stats = [
    { number: "10M+", label: "Happy Travelers", icon: <Users className="w-6 h-6" /> },
    { number: "200+", label: "Countries", icon: <Globe className="w-6 h-6" /> },
    { number: "50K+", label: "Hotels", icon: <Hotel className="w-6 h-6" /> },
    { number: "1M+", label: "Flights Booked", icon: <Plane className="w-6 h-6" /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50 text-slate-800'
    }`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="text-6xl mb-4">✈️</div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover the World with{' '}
              <span className={`${textColors[currentColorIndex]} transition-colors duration-1000`}>
                SkyMate
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}
          >
            Your ultimate all-in-one travel companion. Book flights, hotels, restaurants, and activities. 
            Track your journeys, earn rewards, and connect with a global community of travelers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-full">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 rounded-full">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Secure Booking</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-full">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">Instant Confirmation</span>
            </div>
          </motion.div>

          {/* Enhanced Search Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`p-8 rounded-3xl max-w-5xl mx-auto border ${
              theme === 'dark' 
                ? 'bg-white/10 backdrop-blur-md border-white/20' 
                : 'bg-white/80 backdrop-blur-md border-white/40 shadow-xl'
            }`}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">
              Start Your Journey Today
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="From (City or Airport)"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-white/20 border-white/30 text-white placeholder-gray-300'
                      : 'bg-white/90 border-gray-200 text-slate-800 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div className="relative">
                <NavigationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="To (City or Airport)"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-white/20 border-white/30 text-white placeholder-gray-300'
                      : 'bg-white/90 border-gray-200 text-slate-800 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/90 border-gray-200 text-slate-800'
                  }`}
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/90 border-gray-200 text-slate-800'
                  }`}
                />
              </div>

              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/90 border-gray-200 text-slate-800'
                  }`}
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4+ Passengers</option>
                </select>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-4 rounded-xl font-semibold text-lg text-white hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Flights</span>
            </motion.button>

            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Popular: 
              </span>
              {['New York', 'London', 'Paris', 'Tokyo', 'Dubai'].map((city) => (
                <button
                  key={city}
                  className="px-3 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400 hover:text-blue-300"
                >
                  {city}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Trusted by Millions Worldwide</h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Join our global community of travelers who trust SkyMate for their journeys
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`text-center p-8 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                    : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
                } transition-all duration-300`}
              >
                <div className="flex justify-center mb-4 text-blue-500">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Everything You Need for Perfect Travel</h2>
            <p className={`text-xl max-w-4xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              From booking to memories, SkyMate is your complete travel ecosystem with intelligent features and rewards
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className={`p-8 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15' 
                    : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl'
                } transition-all duration-300 cursor-pointer group`}
              >
                <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-500 transition-colors">
                  {feature.title}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                } group-hover:text-purple-400 transition-colors`}>
                  {feature.description}
                </p>
                <div className={`mt-6 h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SkyMate?</h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              We're revolutionizing travel with cutting-edge technology and personalized experiences
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-6 rounded-xl text-center ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-slate-800/80 to-purple-900/50 border border-purple-500/20' 
                    : 'bg-gradient-to-br from-white/90 to-purple-50/80 border border-purple-200/50 shadow-md'
                } backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex justify-center mb-4 text-blue-500">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trending Destinations</h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Discover the world's most sought-after destinations with exclusive deals
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {popularDestinations.map((destination, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className={`rounded-2xl overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                    : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
                } hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">{destination.image}</div>
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className={`text-sm mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    {destination.description}
                  </p>
                  <div className="text-2xl font-bold text-green-500 mb-4">
                    From {destination.price}
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                    Explore Deals
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Travelers Say</h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Real stories from real travelers who chose SkyMate for their adventures
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-8 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                    : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
                } hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                } italic`}>
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* App Features Showcase */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">More Than Just Booking</h2>
            <p className={`text-xl max-w-4xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              SkyMate is more than a booking platform—it's your travel companion, planner, and community.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Add visual app feature cards here or custom components if needed */}
            <div className="p-8 rounded-2xl text-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2">Community Dashboard</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Connect, share experiences, and see where your friends are traveling.
              </p>
            </div>

            <div className="p-8 rounded-2xl text-center bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-md hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Journey Planner</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Plan your entire trip in one place with seamless booking integration.
              </p>
            </div>

            <div className="p-8 rounded-2xl text-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Goal-Based Travel</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Set travel goals, track achievements, and earn exclusive rewards.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
