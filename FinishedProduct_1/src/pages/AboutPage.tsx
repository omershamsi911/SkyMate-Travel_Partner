import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

const AboutPage: React.FC = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const features = [
    {
      icon: "✈️",
      title: "Flight Booking",
      description: "Find and book the best flights worldwide with real-time prices and instant confirmation.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "🏨",
      title: "Hotel Reservations",
      description: "Discover perfect accommodations from luxury resorts to cozy boutique hotels.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🍽️",
      title: "Restaurant Booking",
      description: "Reserve tables at the world's finest restaurants and local hidden gems.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "🏖️",
      title: "Beach & Activities",
      description: "Explore pristine beaches and book exciting activities at your destination.",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: "📊",
      title: "Personal Dashboard",
      description: "Track your travels, share memories, and manage all your bookings in one place.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: "🏆",
      title: "Badges & Challenges",
      description: "Earn achievements, complete travel challenges, and unlock exclusive rewards.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const benefits = [
    {
      icon: "🎯",
      title: "Smart Recommendations",
      description: "AI-powered suggestions based on your preferences, budget, and travel history."
    },
    {
      icon: "🌦️",
      title: "Weather-Based Planning",
      description: "Get travel recommendations based on perfect weather conditions for your ideal trip."
    },
    {
      icon: "💰",
      title: "Best Deals Engine",
      description: "Our advanced algorithm finds the best prices across millions of options."
    },
    {
      icon: "⭐",
      title: "Star User Program",
      description: "Unlock exclusive perks as you accumulate miles and complete travel milestones."
    },
    {
      icon: "📱",
      title: "All-in-One Platform",
      description: "Everything you need for travel planning and booking in a single, intuitive app."
    },
    {
      icon: "🌍",
      title: "Global Community",
      description: "Connect with fellow travelers, share experiences, and discover new destinations."
    }
  ];

  const stats = [
    { number: "10M+", label: "Happy Travelers" },
    { number: "200+", label: "Countries Covered" },
    { number: "50K+", label: "Partner Hotels" },
    { number: "1M+", label: "Flights Booked" }
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
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center px-4 pt-24 pb-16"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            About SkyMate
          </h1>
          <p className={`text-2xl max-w-4xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Your ultimate travel companion that transforms how you explore the world. 
            We're not just a booking platform – we're your gateway to extraordinary adventures.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`text-center p-6 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                  : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
              }`}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
              }`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            Everything You Need for Perfect Travel
          </h2>
          <p className={`text-xl text-center mb-12 max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
          }`}>
            From planning to memories, SkyMate covers every aspect of your journey
          </p>

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
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-500 transition-colors">
                  {feature.title}
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                } group-hover:text-purple-400 transition-colors`}>
                  {feature.description}
                </p>
                <div className={`mt-4 h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            Why Choose SkyMate?
          </h2>
          <p className={`text-xl text-center mb-12 max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
          }`}>
            We're revolutionizing travel with intelligent features and personalized experiences
          </p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`p-6 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-slate-800/80 to-purple-900/50 border border-purple-500/20' 
                    : 'bg-gradient-to-br from-white/90 to-purple-50/80 border border-purple-200/50 shadow-md'
                } backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
              >
                <div className="text-2xl mb-3">{benefit.icon}</div>
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

      {/* Mission Section */}
      <section className="px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className={`p-12 rounded-3xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-white/20' 
              : 'bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-pink-50/80 border border-white/60 shadow-xl'
          } backdrop-blur-lg`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className={`text-xl leading-relaxed mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-slate-700'
              }`}>
                To democratize travel by making it accessible, affordable, and extraordinary for everyone. 
                We believe that exploring the world should be effortless, and every journey should be 
                filled with discovery, connection, and unforgettable moments.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-3 text-blue-500">Our Vision</h3>
                  <p className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    To become the world's most trusted travel platform, connecting cultures 
                    and creating global citizens through meaningful travel experiences.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-3 text-purple-500">Our Values</h3>
                  <p className={`${
                    theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    Innovation, sustainability, and putting travelers first. We're committed 
                    to responsible tourism that benefits both travelers and destinations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
          <p className={`text-xl mb-12 ${
            theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
          }`}>
            A diverse group of travel enthusiasts, tech innovators, and customer experience experts 
            united by our passion for transforming how the world travels.
          </p>
          
          <div className={`p-10 rounded-2xl ${
            theme === 'dark' 
              ? 'bg-white/10 backdrop-blur-md border border-white/20' 
              : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
          }`}>
            <div className="text-6xl mb-6">🌟</div>
            <h3 className="text-2xl font-semibold mb-4">Building the Future of Travel</h3>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Our team combines decades of travel industry expertise with cutting-edge technology 
              to create solutions that make travel planning intuitive, personalized, and exciting.
            </p>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Join millions of travelers who trust SkyMate to make their dreams come true. 
            Your next adventure is just a click away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-xl font-semibold text-lg text-white hover:shadow-xl transition-all duration-300"
            >
              Get In Touch
            </motion.a>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-block px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-white/30 text-white hover:bg-white/10'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Start Your Journey
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;