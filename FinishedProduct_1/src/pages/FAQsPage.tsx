import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

const faqs = [
  { question: 'How do I book a flight on SkyMate?', answer: 'Simply search for your destination, select your preferred flight, and follow the booking instructions.' },
  { question: 'Can I cancel or change my booking?', answer: 'Yes, you can manage your bookings from your account dashboard. Cancellation and change policies depend on the airline.' },
  { question: 'Is my payment information secure?', answer: 'Absolutely. We use industry-standard encryption to protect your data.' },
  { question: 'How do I contact customer support?', answer: 'You can reach us via the Contact Us page or email support@skymate.com.' },
  { question: 'What makes SkyMate different?', answer: 'SkyMate offers smart AI-based recommendations, real-time weather planning, and a reward system for frequent travelers.' },
  { question: 'How does the Star User Program work?', answer: 'Earn exclusive rewards by completing travel milestones and accumulating miles on your bookings.' },
  { question: 'Can I track all my bookings in one place?', answer: 'Yes! Your personal dashboard helps you track flights, hotels, restaurants, and more in one unified platform.' },
];

const FAQsPage: React.FC = () => {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50'}`}>
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center px-4 pt-28 pb-16"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            FAQs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg max-w-xl mx-auto text-gray-300"
          >
            Find answers to the most common questions about SkyMate.
          </motion.p>
        </div>

        <div className="w-full max-w-3xl space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-5 focus:outline-none flex justify-between items-center hover:bg-white/15 transition-all duration-200"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-lg font-semibold text-white">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === idx ? 90 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="ml-4 text-blue-400 font-bold text-xl"
                >
                  ▶
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden px-6 text-gray-300"
                  >
                    <div className="pb-5 pt-2">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center text-gray-300"
        >
          <p className="mb-4">Still need help?</p>
          <button className="px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            Contact Our Support Team
          </button>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default FAQsPage;