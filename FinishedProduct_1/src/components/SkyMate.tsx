import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import DealsSection from './DealsSection';
import StatsSection from './StatsSection';
import CTASection from './CTASection';
import Footer from './Footer';
import BookFlight from './BookFlight';
import UpcomingFlights from './UpcomingFlights';
import FlightHistory from './FlightHistory';

const SkyMate = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [showBookFlight, setShowBookFlight] = useState(false);
  const [showUpcomingFlights, setShowUpcomingFlights] = useState(false);
  const [showFlightHistory, setShowFlightHistory] = useState(false);

  // Animated text colors
  const textColors = ['text-blue-500', 'text-purple-500', 'text-pink-500', 'text-indigo-500'];
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % textColors.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <Navigation 
        setSidebarOpen={setSidebarOpen}
      />

      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Hero Section */}
      <HeroSection
        searchFrom={searchFrom}
        setSearchFrom={setSearchFrom}
        searchTo={searchTo}
        setSearchTo={setSearchTo}
        departDate={departDate}
        setDepartDate={setDepartDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        currentColorIndex={currentColorIndex}
        textColors={textColors}
        onSearchClick={() => setShowBookFlight(true)}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Best Deals Section */}
      <DealsSection />

      {/* Statistics Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {showBookFlight && (
        <BookFlight />
      )}
      
      {showUpcomingFlights && (
        <UpcomingFlights onClose={() => setShowUpcomingFlights(false)} />
      )}
      
      {showFlightHistory && (
        <FlightHistory onClose={() => setShowFlightHistory(false)} />
      )}
    </div>
  );
};

export default SkyMate;
