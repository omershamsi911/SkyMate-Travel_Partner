import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

const helpTopics = [
  { title: 'Booking Issues', description: 'Having trouble booking a flight? Find solutions here.' },
  { title: 'Account Management', description: 'Learn how to manage your SkyMate account.' },
  { title: 'Payment & Refunds', description: 'Information about payment methods and refund policies.' },
  { title: 'Travel Safety', description: 'Tips and guidelines for safe travel.' },
];

const HelpCenterPage: React.FC = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const filteredTopics = helpTopics.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50'} text-white`}>
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center px-4 pt-24 pb-12"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-300">How can we help you today?</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-2xl mb-12"
        >
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search help topics..."
              className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:bg-white/25"
            />
            <motion.div
              animate={{ 
                opacity: search ? 1 : 0.7,
                x: search ? 0 : -5
              }}
              transition={{ type: 'spring' }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.a
            href="/faqs"
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 font-semibold text-lg text-center hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
          >
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="mb-3 text-3xl"
            >
              ❓
            </motion.div>
            FAQs
          </motion.a>
          
          <motion.a
            href="/contact"
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 font-semibold text-lg text-center hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center"
          >
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="mb-3 text-3xl"
            >
              ✉️
            </motion.div>
            Contact Support
          </motion.a>
        </motion.div>

        <div className="w-full max-w-2xl">
          <motion.h2 
            className="text-2xl font-semibold mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            Popular Help Topics
          </motion.h2>
          
          <AnimatePresence>
            {filteredTopics.length > 0 ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {filteredTopics.map((topic, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + idx * 0.1, type: 'spring' }}
                    whileHover={{ 
                      y: -3,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)'
                    }}
                    className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 cursor-pointer transition-all duration-300 hover:shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2 flex items-center">
                      <motion.span 
                        className="mr-3"
                        animate={{ rotate: [0, 10, -5, 0] }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          duration: 2
                        }}
                      >
                        ✨
                      </motion.span>
                      {topic.title}
                    </h3>
                    <p className="text-gray-300 pl-9">{topic.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <p className="text-xl text-gray-300">No results found for "{search}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
};

export default HelpCenterPage;