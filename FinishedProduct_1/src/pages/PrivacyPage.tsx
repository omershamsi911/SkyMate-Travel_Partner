import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';

const privacySections = [
  {
    title: "1. Information We Collect",
    icon: "📋",
    content: "SkyMate collects various types of information to provide and improve our services:",
    points: [
      "Personal Information: Name, email, phone number, payment details",
      "Travel Preferences: Flight preferences, seat choices, meal requirements",
      "Device Information: IP address, browser type, operating system",
      "Usage Data: Pages visited, features used, search queries"
    ]
  },
  {
    title: "2. How We Use Your Data",
    icon: "🔍",
    content: "Your information helps us deliver personalized travel experiences:",
    points: [
      "To process and manage your bookings and reservations",
      "To provide personalized recommendations and travel insights",
      "To improve our services and develop new features",
      "To communicate important service updates and offers",
      "To prevent fraud and ensure account security"
    ]
  },
  {
    title: "3. Data Sharing & Disclosure",
    icon: "🤝",
    content: "We may share information in these limited circumstances:",
    points: [
      "With airlines, hotels, and travel partners to fulfill your bookings",
      "With payment processors to complete transactions",
      "When required by law or to respond to legal processes",
      "With service providers who assist our operations (under strict confidentiality)",
      "In case of business transfers (mergers or acquisitions)"
    ]
  },
  {
    title: "4. Your Privacy Rights",
    icon: "🛡️",
    content: "You have control over your personal information:",
    points: [
      "Access and download your data through your account settings",
      "Request correction of inaccurate or incomplete information",
      "Delete your account and associated personal data",
      "Opt-out of marketing communications",
      "Withdraw consent where processing is based on consent"
    ]
  },
  {
    title: "5. Data Security",
    icon: "🔒",
    content: "We implement robust security measures:",
    points: [
      "Industry-standard encryption for data transmission",
      "Regular security audits and vulnerability testing",
      "Limited employee access to personal data",
      "Secure servers with firewall protection",
      "Two-factor authentication options"
    ]
  },
  {
    title: "6. Cookies & Tracking",
    icon: "🍪",
    content: "We use cookies and similar technologies:",
    points: [
      "Essential cookies for website functionality",
      "Analytics cookies to understand user behavior",
      "Preference cookies to remember your settings",
      "Advertising cookies for personalized offers",
      "You can manage cookie preferences in your browser"
    ]
  }
];

const PrivacyPage: React.FC = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [showConsent, setShowConsent] = useState(true);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50'} text-white`}>
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring' }}
            className="fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-md border-t border-white/30 z-50"
          >
            <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-300 mb-4 md:mb-0 md:mr-8">
                We use cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.
              </p>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/30"
                  onClick={() => setShowConsent(false)}
                >
                  Accept All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-purple-600/90"
                  onClick={() => setShowConsent(false)}
                >
                  Manage Preferences
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center px-4 pt-28 pb-32"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12 max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300">
            Effective: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Policy Sections</h2>
              <ul className="space-y-2">
                {privacySections.map((section, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer px-4 py-3 rounded-lg transition-all flex items-center ${activeSection === index ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                    onClick={() => setActiveSection(index)}
                  >
                    <span className="mr-3 text-lg">{section.icon}</span>
                    <span className="truncate">{section.title.split(' ').slice(1).join(' ')}</span>
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
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                {privacySections.map((section, index) => (
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
                        className="text-2xl font-bold mb-6 flex items-center"
                        whileHover={{ x: 3 }}
                      >
                        <span className="mr-4 text-3xl">{section.icon}</span>
                        <span>{section.title}</span>
                      </motion.h2>
                      <p className="text-gray-300 mb-6 text-lg leading-relaxed">{section.content}</p>
                      <ul className="space-y-4">
                        {section.points.map((point, pointIndex) => (
                          <motion.li
                            key={pointIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * pointIndex }}
                            className="flex items-start text-gray-300 bg-white/5 rounded-lg p-4"
                          >
                            <span className="inline-block mr-4 mt-1 text-blue-400 text-xl">•</span>
                            <span className="flex-1">{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-300">Have questions about your privacy?</h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium"
                >
                  Contact Our Privacy Team
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-white/10 border border-white/30 rounded-lg font-medium"
                >
                  Download Your Data
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default PrivacyPage;