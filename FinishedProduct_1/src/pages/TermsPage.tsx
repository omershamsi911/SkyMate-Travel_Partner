import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using SkyMate, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.",
    points: [
      "These terms apply to all visitors, users, and others who access the service.",
      "Your use of SkyMate constitutes acceptance of these terms.",
      "We may modify these terms at any time without prior notice."
    ]
  },
  {
    title: "2. User Responsibilities",
    content: "As a user of SkyMate, you agree to the following responsibilities:",
    points: [
      "You must be at least 18 years of age to use this service.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree not to engage in unlawful activities or violate any applicable laws.",
      "You will not transmit any viruses or malicious code through our services."
    ]
  },
  {
    title: "3. Service Provisions",
    content: "SkyMate provides the following services under these conditions:",
    points: [
      "Flight booking and travel planning services",
      "Personalized recommendations based on your preferences",
      "Real-time travel updates and notifications",
      "Customer support during business hours"
    ]
  },
  {
    title: "4. Limitations of Liability",
    content: "SkyMate's liability is limited as follows:",
    points: [
      "We are not responsible for any indirect, incidental, or consequential damages.",
      "We do not guarantee uninterrupted or error-free service.",
      "We are not liable for third-party services or content.",
      "Our maximum liability shall not exceed the amount you paid for our services."
    ]
  },
  {
    title: "5. Privacy Policy",
    content: "Your privacy is important to us. Please review our Privacy Policy which explains:",
    points: [
      "How we collect and use your personal information",
      "With whom we share your information",
      "Your rights regarding your personal data",
      "Our data security measures"
    ]
  }
];

const TermsPage: React.FC = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50'} text-white`}>
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center px-4 pt-28 pb-16"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12 max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Sidebar navigation */}
          <motion.div 
            className="lg:w-1/4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="sticky top-28">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Sections</h2>
              <ul className="space-y-2">
                {termsSections.map((section, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer px-4 py-2 rounded-lg transition-colors ${activeSection === index ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                    onClick={() => setActiveSection(index)}
                  >
                    {section.title}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div 
            className="lg:w-3/4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              <AnimatePresence mode="wait">
                {termsSections.map((section, index) => (
                  (activeSection === null || activeSection === index) && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: activeSection === null ? 0 : (index > (activeSection || 0) ? 20 : -20) }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: activeSection === null ? 0 : (index > (activeSection || 0) ? -20 : 20) }}
                      transition={{ duration: 0.3 }}
                      className="p-8"
                    >
                      <motion.h2 
                        className="text-2xl font-bold mb-4 flex items-center"
                        whileHover={{ x: 3 }}
                      >
                        <span className="mr-3 text-blue-400">§</span>
                        {section.title}
                      </motion.h2>
                      <p className="text-gray-300 mb-6">{section.content}</p>
                      <ul className="space-y-3">
                        {section.points.map((point, pointIndex) => (
                          <motion.li
                            key={pointIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * pointIndex }}
                            className="flex items-start text-gray-300"
                          >
                            <span className="inline-block mr-3 mt-1 text-blue-400">•</span>
                            {point}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-gray-400 mb-4">By using our services, you acknowledge that you have read and understood these terms.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium"
              >
                I Accept the Terms
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default TermsPage;