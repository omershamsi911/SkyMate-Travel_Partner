import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkyMate
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Your intelligent travel companion for discovering the world with ease and style. 
              Experience seamless booking, smart recommendations, and unforgettable journeys.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map(({ Icon, href, label }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Destinations', path: '/destinations' },
                { name: 'Best Deals', path: '/deals' },
                { name: 'My Bookings', path: '/upcoming-flights' },
                { name: 'About SkyMate', path: '/about' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Support</h3>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', path: '/contact' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Help Center', path: '/help' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Privacy Policy', path: '/privacy' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white font-medium">hello@skymate.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-gray-900 dark:text-white font-medium">New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-400">
                © 2025 SkyMate. All rights reserved. Made with ❤️ for travelers worldwide.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms
              </Link>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 