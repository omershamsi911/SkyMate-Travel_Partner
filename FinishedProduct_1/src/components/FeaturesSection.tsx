import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Zap, Trophy } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Book flights to over 1000 destinations worldwide with our extensive network.'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your data is protected with bank-level security and encryption.'
    },
    {
      icon: Zap,
      title: 'Instant Confirmation',
      description: 'Get instant booking confirmations and e-tickets delivered immediately.'
    },
    {
      icon: Trophy,
      title: 'Best Price Guarantee',
      description: 'We guarantee the best prices or we\'ll match and beat any competitor.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SkyMate?</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Experience the future of travel booking with our innovative features and personalized service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 