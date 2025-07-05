import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, User, Menu, Sun, Moon, Settings, LogOut, Search,  Heart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationProps {
  setSidebarOpen: (value: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setSidebarOpen }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user display information
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Deals', path: '/deals' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Community', path: '/community-photos' },
    { name: 'About', path: '/about' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to deals page with search query
      navigate(`/deals?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <Plane className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SkyMate
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className=" p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            {!user ? (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg font-semibold text-white hover:shadow-lg transition-all duration-200"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {getUserAvatar() ? (
                    <img 
                      src={getUserAvatar()} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </motion.div>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                        <div className="font-semibold text-gray-900 dark:text-white">{getUserDisplayName()}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Heart className="w-4 h-4 mr-3" />
                          Wishlist
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-4"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for flights, hotels, destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;