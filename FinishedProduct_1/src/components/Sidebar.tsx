import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Calendar, History, Heart, Settings, User, HelpCircle, Info, FileText, ShieldCheck, Mail, Home, DollarSign, Globe, LogOut, Hotel, MapPin, CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Home',
      icon: Home,
      href: '/',
      requiresAuth: false,
      category: 'main',
      description: 'Dashboard overview'
    },
    {
      name: 'Book Flight',
      icon: Plane,
      href: '/book-flight',
      requiresAuth: false,
      category: 'main',
      description: 'Search & book flights'
    },
    {
      name: 'Book Hotel',
      icon: Hotel,
      href: '/book-hotel',
      requiresAuth: false,
      category: 'main',
      description: 'Find & reserve hotels'
    },
    {
      name: 'Journey Dashboard',
      icon: MapPin,
      href: '/journey-dashboard',
      requiresAuth: true,
      category: 'main',
      description: 'Track your trips'
    },
    {
      name: 'Deals',
      icon: DollarSign,
      href: '/deals',
      requiresAuth: false,
      category: 'main',
      description: 'Special offers'
    },
    {
      name: 'Destinations',
      icon: Globe,
      href: '/destinations',
      requiresAuth: false,
      category: 'main',
      description: 'Explore places'
    },
    {
      name: 'Upcoming Flights',
      icon: Calendar,
      href: '/upcoming-flights',
      requiresAuth: true,
      category: 'user',
      description: 'Next adventures'
    },
    {
      name: 'Flight History',
      icon: History,
      href: '/flight-history',
      requiresAuth: true,
      category: 'user',
      description: 'Past journeys'
    },
    {
      name: 'Hotel Confirmations',
      icon: CheckCircle2,
      href: '/hotel-confirmation-dashboard',
      requiresAuth: true,
      category: 'user',
      description: 'Hotel bookings'
    },
    {
      name: 'Wishlist',
      icon: Heart,
      href: '/wishlist',
      requiresAuth: true,
      category: 'user',
      description: 'Saved favorites'
    },
    {
      name: 'Profile',
      icon: User,
      href: '/profile',
      requiresAuth: true,
      category: 'user',
      description: 'Account settings'
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/settings',
      requiresAuth: true,
      category: 'user',
      description: 'Preferences'
    },
    {
      name: 'About Us',
      icon: Info,
      href: '/about',
      requiresAuth: false,
      category: 'support',
      description: 'Our story'
    },
    {
      name: 'Contact Us',
      icon: Mail,
      href: '/contact',
      requiresAuth: false,
      category: 'support',
      description: 'Get in touch'
    },
    {
      name: 'FAQs',
      icon: HelpCircle,
      href: '/faqs',
      requiresAuth: false,
      category: 'support',
      description: 'Quick answers'
    },
    {
      name: 'Terms of Service',
      icon: FileText,
      href: '/terms',
      requiresAuth: false,
      category: 'legal',
      description: 'User agreement'
    },
    {
      name: 'Privacy Policy',
      icon: ShieldCheck,
      href: '/privacy',
      requiresAuth: false,
      category: 'legal',
      description: 'Data protection'
    },
    {
      name: 'Help Center',
      icon: HelpCircle,
      href: '/help',
      requiresAuth: false,
      category: 'support',
      description: 'Support portal'
    },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.requiresAuth || user);

  const groupedItems = {
    main: filteredMenuItems.filter(item => item.category === 'main'),
    user: filteredMenuItems.filter(item => item.category === 'user'),
    support: filteredMenuItems.filter(item => item.category === 'support'),
    legal: filteredMenuItems.filter(item => item.category === 'legal'),
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSidebarOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.03,
        duration: 0.4,
        ease: "easeOut" as const
      }
    }),
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            aria-label="Sidebar backdrop"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              duration: 0.5
            }}
            className="fixed left-0 top-0 h-full w-80 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl shadow-2xl border-r border-gray-200/30 dark:border-slate-700/30 z-50"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex flex-col h-full">
              {/* Decorative background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-500/8 to-purple-600/8 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-purple-500/8 to-blue-600/8 rounded-full blur-3xl animate-pulse"></div>
              </div>

              {/* Header */}
              <motion.div 
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative flex items-center justify-between p-6 border-b border-gray-200/40 dark:border-slate-700/40"
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-30 blur-lg"></div>
                  </motion.div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      SkyMate
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                      Your Travel Companion
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(false)}
                  className="p-3 rounded-2xl bg-gray-100/60 dark:bg-slate-800/60 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all duration-200 group"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                </motion.button>
              </motion.div>

              {/* User Profile */}
              {user && (
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative p-6 border-b border-gray-200/40 dark:border-slate-700/40"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                        {user.user_metadata?.avatar_url ? (
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt="Profile" 
                            className="w-16 h-16 rounded-2xl object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                        {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* Main Navigation */}
                  {groupedItems.main.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
                        <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          Main Menu
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {groupedItems.main.map((item, index) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.href;
                          return (
                            <motion.li 
                              key={item.name}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              custom={index}
                            >
                              <Link
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`group relative flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                                  isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                              >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                                  isActive 
                                    ? 'bg-white/20 backdrop-blur-sm' 
                                    : 'bg-gray-100/60 dark:bg-slate-800/60 group-hover:bg-blue-100/80 dark:group-hover:bg-blue-900/30'
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="font-semibold text-sm block truncate">{item.name}</span>
                                  <span className={`text-xs block truncate mt-0.5 ${
                                    isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {item.description}
                                  </span>
                                </div>
                                {isActive && (
                                  <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-lg"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  />
                                )}
                              </Link>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}

                  {/* User Navigation */}
                  {user && groupedItems.user.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3"></div>
                        <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          My Account
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {groupedItems.user.map((item, index) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.href;
                          return (
                            <motion.li 
                              key={item.name}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              custom={index + 6}
                            >
                              <Link
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`group relative flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
                                  isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                              >
                                <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 ${
                                  isActive 
                                    ? 'bg-white/20 backdrop-blur-sm' 
                                    : 'bg-gray-100/60 dark:bg-slate-800/60 group-hover:bg-blue-100/80 dark:group-hover:bg-blue-900/30'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="font-medium text-sm block truncate">{item.name}</span>
                                  <span className={`text-xs block truncate mt-0.5 ${
                                    isActive ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {item.description}
                                  </span>
                                </div>
                              </Link>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}

                  {/* Support & Legal */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                  >
                    {groupedItems.support.length > 0 && (
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-3"></div>
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Support
                          </h3>
                        </div>
                        <ul className="space-y-1">
                          {groupedItems.support.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`group flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                                    isActive
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400'
                                  }`}
                                >
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                                    isActive 
                                      ? 'bg-white/20' 
                                      : 'bg-gray-100/60 dark:bg-slate-800/60 group-hover:bg-blue-100/80 dark:group-hover:bg-blue-900/30'
                                  }`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {groupedItems.legal.length > 0 && (
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mr-3"></div>
                          <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Legal
                          </h3>
                        </div>
                        <ul className="space-y-1">
                          {groupedItems.legal.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`group flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                                    isActive
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-slate-800/60 hover:text-blue-600 dark:hover:text-blue-400'
                                  }`}
                                >
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                                    isActive 
                                      ? 'bg-white/20' 
                                      : 'bg-gray-100/60 dark:bg-slate-800/60 group-hover:bg-blue-100/80 dark:group-hover:bg-blue-900/30'
                                  }`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium text-sm">{item.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </div>
              </nav>

              {/* Footer */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative p-6 border-t border-gray-200/40 dark:border-slate-700/40"
              >
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-300 group mb-4 mt-4"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100/60 dark:bg-red-900/30 group-hover:bg-red-200/80 dark:group-hover:bg-red-800/40 transition-all duration-300">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-sm block">Sign Out</span>
                      <span className="text-xs text-red-500/70 dark:text-red-400/70 block">End your session</span>
                    </div>
                  </motion.button>
                )}
                
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-slate-800/60 dark:to-slate-700/60 rounded-2xl border border-gray-200/40 dark:border-slate-600/40">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Plane className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-50 blur-sm"></div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-gray-900 dark:text-white">SkyMate</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">v2.0</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;