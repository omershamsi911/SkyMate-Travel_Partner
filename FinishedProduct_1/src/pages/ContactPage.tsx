import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'support@skymate.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 5pm'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: '123 SkyMate Ave',
      description: 'Travel City, World'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50'}`}>
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className={`text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent`}>
              Get in Touch
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 space-y-8"
            >
              <div>
                <h2 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                          <info.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {info.title}
                          </h3>
                          <p className={`font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                            {info.content}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} backdrop-blur-sm shadow-2xl`}>
                <h2 className={`text-2xl font-semibold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          theme === 'dark' 
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`w-full px-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitted}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                      submitted
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {submitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Message Sent!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} backdrop-blur-sm`}>
              <h3 className={`text-2xl font-semibold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Visit Our Office
              </h3>
              <div className={`w-full h-64 rounded-2xl flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/5' 
                  : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-100'
              }`}>
                <div className="text-center">
                  <MapPin className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Interactive Map Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
