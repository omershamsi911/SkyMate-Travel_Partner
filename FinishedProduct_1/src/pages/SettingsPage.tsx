import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Sun, Moon, Bell, CreditCard, HelpCircle, LogOut, Save } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import supabase from '../config/supabase';


const SettingsPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    profilePicture: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    flightUpdates: true,
    priceAlerts: true,
    promotionalEmails: false
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfileData({
          firstName: data.first_name || user?.user_metadata?.first_name || '',
          lastName: data.last_name || user?.user_metadata?.last_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
          dateOfBirth: data.date_of_birth || '',
          nationality: data.nationality || '',
          passportNumber: data.passport_number || '',
          profilePicture: data.profile_picture || user?.user_metadata?.avatar_url || ''
        });

        setNotifications({
          emailNotifications: data.email_notifications ?? true,
          pushNotifications: data.push_notifications ?? true,
          smsNotifications: data.sms_notifications ?? false,
          flightUpdates: data.flight_updates ?? true,
          priceAlerts: data.price_alerts ?? true,
          promotionalEmails: data.promotional_emails ?? false
        });
      } else {
        // Set default values from user metadata if no profile exists
        setProfileData(prev => ({
          ...prev,
          firstName: user?.user_metadata?.first_name || '',
          lastName: user?.user_metadata?.last_name || '',
          email: user?.email || '',
          profilePicture: user?.user_metadata?.avatar_url || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const profilePayload = {
        user_id: user?.id,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        date_of_birth: profileData.dateOfBirth || null,
        nationality: profileData.nationality,
        passport_number: profileData.passportNumber,
        profile_picture: profileData.profilePicture,
        email_notifications: notifications.emailNotifications,
        push_notifications: notifications.pushNotifications,
        sms_notifications: notifications.smsNotifications,
        flight_updates: notifications.flightUpdates,
        price_alerts: notifications.priceAlerts,
        promotional_emails: notifications.promotionalEmails,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profilePayload, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      // Update auth user metadata if name changed
      if (profileData.firstName || profileData.lastName) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            display_name: `${profileData.firstName} ${profileData.lastName}`.trim()
          }
        });

        if (updateError) {
          console.error('Error updating user metadata:', updateError);
        }
      }

      // Show success message (you can implement toast notifications)
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

    const handleProfilePictureChange = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target?.files?.[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setUploading(true);
      try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
        const filePath = `profile-pictures/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('avatars') // Make sure this bucket exists in your Supabase project
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Update profile data
        setProfileData(prev => ({
          ...prev,
          profilePicture: publicUrl
        }));

        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            avatar_url: publicUrl
          }
        });

        if (updateError) {
          console.error('Error updating user avatar:', updateError);
        }

        // Update profile in database
        const { error: dbError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user?.id,
            profile_picture: publicUrl,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (dbError) {
          console.error('Error updating profile picture in database:', dbError);
        }

        alert('Profile picture updated successfully!');

      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture. Please try again.');
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50'} text-white`}>
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {/* Main Content */}
      <div className="pt-16">
        {/* Header */}
        <section className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">Settings</h1>
              <p className="text-xl text-gray-300">
                Manage your account preferences and profile
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <User className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold">Profile Information</h2>
                </div>

                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {profileData.profilePicture ? (
                        <img 
                          src={profileData.profilePicture} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleProfilePictureChange}
                      disabled={uploading}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </motion.button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profileData.firstName && profileData.lastName 
                        ? `${profileData.firstName} ${profileData.lastName}` 
                        : (user?.user_metadata?.displayName || user?.email || 'User')
                      }
                    </h3>
                    <p className="text-gray-300">{profileData.email || user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={profileData.nationality}
                      onChange={(e) => handleProfileChange('nationality', e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nationality"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Passport Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={profileData.passportNumber}
                      onChange={(e) => handleProfileChange('passportNumber', e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Passport number"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <Bell className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold">Notifications</h2>
                </div>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                        <p className="text-sm text-gray-300">
                          {key.includes('email') ? 'Receive notifications via email' :
                           key.includes('push') ? 'Receive push notifications' :
                           key.includes('sms') ? 'Receive SMS notifications' :
                           key.includes('flight') ? 'Get updates about your flights' :
                           key.includes('price') ? 'Get alerts for price changes' :
                           'Receive promotional emails'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNotificationChange(key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Theme Toggle */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  {theme === 'dark' ? <Moon className="w-6 h-6 text-blue-400" /> : <Sun className="w-6 h-6 text-blue-400" />}
                  <h3 className="text-lg font-semibold">Theme</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </motion.button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Methods</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Help & Support</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 p-3 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-red-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 