import React from 'react';
import { motion } from 'framer-motion';

const DealsSection: React.FC = () => {
  const bestDeals = [
    {
      destination: 'Paris, France',
      price: '$599',
      originalPrice: '$899',
      discount: '33% OFF',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      airline: 'Air France'
    },
    {
      destination: 'Tokyo, Japan',
      price: '$789',
      originalPrice: '$1299',
      discount: '39% OFF',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      airline: 'JAL Airlines'
    },
    {
      destination: 'Bali, Indonesia',
      price: '$449',
      originalPrice: '$699',
      discount: '36% OFF',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
      airline: 'Garuda Indonesia'
    },
    {
      destination: 'New York, USA',
      price: '$399',
      originalPrice: '$699',
      discount: '43% OFF',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
      airline: 'Delta Airlines'
    }
  ];

  return (
    <section id="deals" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🔥 Best Deals This Week
          </h2>
          <p className="text-gray-300 text-lg">
            Don't miss these incredible offers on popular destinations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestDeals.map((deal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-blue-500/50 transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.destination}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {deal.discount}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{deal.destination}</h3>
                <p className="text-gray-400 text-sm mb-3">{deal.airline}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-400">{deal.price}</span>
                    <span className="text-gray-400 line-through ml-2">{deal.originalPrice}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealsSection; 