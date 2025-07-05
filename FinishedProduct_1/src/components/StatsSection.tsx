import React from 'react';
import { motion } from 'framer-motion';

const StatsSection: React.FC = () => {
  const stats = [
    { number: '2M+', label: 'Happy Travelers' },
    { number: '1000+', label: 'Destinations' },
    { number: '50+', label: 'Airlines' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 
 