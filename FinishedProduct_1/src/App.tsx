
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BookFlightPage from './pages/BookFlightPage';
import BookHotelPage from './pages/BookHotelPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import HotelBookingConfirmationPage from './pages/HotelBookingConfirmationPage';
import UpcomingFlightsPage from './pages/UpcomingFlightsPage';
import FlightHistoryPage from './pages/FlightHistoryPage';
import JourneyDashboardPage from './pages/JourneyDashboardPage';
import TrackFlightPage from './pages/TrackFlight';
import WishlistPage from './pages/WishlistPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQsPage from './pages/FAQsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import HelpCenterPage from './pages/HelpCenterPage';
import DealsPage from './pages/Deals';
import ProfilePage from './pages/ProfilePage';
import DestinationsPage from './pages/Destinations';
import CommunityPhotos from './pages/CommunityPhotos';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/book-flight" element={<BookFlightPage />} />
              <Route path="/book-hotel" element={<BookHotelPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
              <Route path="/hotel-booking-confirmation" element={<HotelBookingConfirmationPage />} />
              <Route path="/track-flight" element={<TrackFlightPage />} />
              <Route path="/community-photos" element={<CommunityPhotos />} />
              
              {/* Protected Routes */}
              <Route 
                path="/upcoming-flights" 
                element={
                  <ProtectedRoute>
                    <UpcomingFlightsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/flight-history" 
                element={
                  <ProtectedRoute>
                    <FlightHistoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/journey-dashboard" 
                element={
                  <ProtectedRoute>
                    <JourneyDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wishlist" 
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faqs" element={<FAQsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
