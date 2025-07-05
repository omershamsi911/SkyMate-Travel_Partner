// src/pages/ProfilePage.tsx
import {useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import { User, Plane, MapPin, Globe, Award, Star, Mountain, Camera, Compass, Plus, Trash2, Heart, Calendar, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';
import { getLikesCount } from '../services/likesService';

interface PhotoData {
  id: string;
  filePath: string;
  url: string;
  description?: string;
  location?: string;
  created_at: string;
  likes: number;
}

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [travelPictures, setTravelPictures] = useState<PhotoData[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'photos'>('profile');
  const [uploading, setUploading] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState<string | null>(null);
  const {user} = useAuth();
  
  // Mock user data
  const userData = {
    name: "Alex Johnson",
    membership: "Elite Explorer",
    joinDate: "Jan 2022",
    milesTraveled: 24850,
    tripsTaken: 18,
    flightsBooked: 42,
    countriesVisited: 12,
    favoriteDestination: "Tokyo, Japan",
    upcomingTrip: "Bali, Indonesia - Aug 2024"
  };

  // Badges data
  const badges = [
    { id: 1, name: "First Flight", icon: <Plane size={20} />, earned: true },
    { id: 2, name: "5K Miles", icon: <Compass size={20} />, earned: true },
    { id: 3, name: "Globetrotter", icon: <Globe size={20} />, earned: true },
    { id: 4, name: "Mountain Seeker", icon: <Mountain size={20} />, earned: true },
    { id: 5, name: "10 Trips", icon: <Star size={20} />, earned: true },
    { id: 6, name: "25K Miles", icon: <Award size={20} />, earned: false },
    { id: 7, name: "Continental Explorer", icon: <Globe size={20} />, earned: false },
    { id: 8, name: "50 Flights", icon: <Plane size={20} />, earned: false },
  ];

  // Stats data
  const stats = [
    { id: 1, name: "Miles Traveled", value: userData.milesTraveled, icon: <Compass className="w-5 h-5" /> },
    { id: 2, name: "Trips Taken", value: userData.tripsTaken, icon: <MapPin className="w-5 h-5" /> },
    { id: 3, name: "Flights Booked", value: userData.flightsBooked, icon: <Plane className="w-5 h-5" /> },
    { id: 4, name: "Countries Visited", value: userData.countriesVisited, icon: <Globe className="w-5 h-5" /> },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length || !user) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('travel-pictures')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Save to database
        const { data: photoData, error: dbError } = await supabase
          .from('user_photos')
          .insert([{ 
            user_id: user.id, 
            file_path: filePath,
            description: file.name.replace(/\.[^/.]+$/, ""), // Use filename as description
            location: '',
            likes: 0
          }])
          .select()
          .single();

        if (dbError) {
          console.error('DB error:', dbError);
          throw new Error(`Database error: ${dbError.message}`);
        }

        return {
          id: photoData.id,
          filePath,
          url: supabase.storage.from('travel-pictures').getPublicUrl(filePath).data.publicUrl,
          description: photoData.description,
          location: photoData.location,
          created_at: photoData.created_at,
          likes: 0
        };
      });

      // Process all uploads
      const newPhotos = await Promise.all(uploadPromises);
      setTravelPictures(prev => [...newPhotos, ...prev]);
      
      e.target.value = ''; // Reset input
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_photos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching photos:', error);
          return;
        }
        
        // Get likes count for each photo
        const photosWithLikes = await Promise.all(
          data.map(async (photo) => {
            const likesCount = await getLikesCount(photo.id);
            return {
              id: photo.id,
              filePath: photo.file_path,
              url: supabase.storage
                .from('travel-pictures')
                .getPublicUrl(photo.file_path).data.publicUrl,
              description: photo.description,
              location: photo.location,
              created_at: photo.created_at,
              likes: likesCount
            };
          })
        );
        
        setTravelPictures(photosWithLikes);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };
    
    fetchPhotos();
  }, [user]);

  const handleDeletePhoto = async (photoId: string, filePath: string) => {
    if (!user) return;
    
    setDeletingPhoto(photoId);
    
    try {
      // First, delete any associated likes
      const { error: likesError } = await supabase
        .from('likes')
        .delete()
        .eq('photo_id', photoId);

      if (likesError) {
        console.error('Error deleting likes:', likesError);
      }

      // Delete from database first
      const { error: dbError } = await supabase
        .from('user_photos')
        .delete()
        .eq('id', photoId)
        .eq('user_id', user.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        throw new Error(`Failed to delete photo from database: ${dbError.message}`);
      }

      // Then delete from storage
      const { error: storageError } = await supabase.storage
        .from('travel-pictures')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Don't throw error here as the database record is already deleted
        console.warn('Photo deleted from database but storage cleanup failed');
      }

      // Update local state
      setTravelPictures(prev => prev.filter(photo => photo.id !== photoId));
      
      console.log('Photo deleted successfully');
      
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert(`Failed to delete photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeletingPhoto(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalLikes = travelPictures.reduce((sum, photo) => sum + photo.likes, 0);

  return (
    <div className={`min-h-screen ${theme === 'dark' 
      ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
      : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-100'} text-white`}>
      
      {/* Main Content */}
      <div className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-8 mb-8 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-white/20' 
              : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-gray-200 shadow-md'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="rounded-full w-24 h-24 md:mr-6 overflow-hidden border-2 border-white">
              {(user?.user_metadata.avatar_url || user?.user_metadata.picture) ? (
                <img 
                  src={user?.user_metadata.avatar_url || user?.user_metadata.picture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-500" />
                </div>
              )}
            </div>
            <div className="text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-3xl font-bold mb-2">
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-lg opacity-80 mb-2">{userData.membership}</p>
              <p className="text-sm opacity-60">Member since {userData.joinDate}</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'photos'
                ? 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            Photos ({travelPictures.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className={`p-6 rounded-2xl text-center ${
                    theme === 'dark' 
                      ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                      : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-blue-500/20">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value.toLocaleString()}</div>
                  <div className="text-sm opacity-70">{stat.name}</div>
                </div>
              ))}
            </motion.div>

            {/* Additional Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                  : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
              }`}>
                <h3 className="text-xl font-semibold mb-4">Photo Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">Total Photos</span>
                    <span className="font-semibold">{travelPictures.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">Total Likes</span>
                    <span className="font-semibold">{totalLikes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">Average Likes</span>
                    <span className="font-semibold">
                      {travelPictures.length > 0 ? Math.round(totalLikes / travelPictures.length) : 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                  : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
              }`}>
                <h3 className="text-xl font-semibold mb-4">Travel Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 opacity-70" />
                    <div>
                      <div className="text-sm opacity-70">Favorite Destination</div>
                      <div className="font-semibold">{userData.favoriteDestination}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Plane className="w-5 h-5 opacity-70" />
                    <div>
                      <div className="text-sm opacity-70">Next Trip</div>
                      <div className="font-semibold">{userData.upcomingTrip}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                  : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
              }`}
            >
              <h3 className="text-xl font-semibold mb-6">Achievement Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl text-center transition-all duration-200 ${
                      badge.earned
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'bg-white/5 border border-white/10 opacity-50'
                          : 'bg-gray-100 border border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {badge.icon}
                    </div>
                    <div className="text-sm font-medium">{badge.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* Upload Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-white/10 backdrop-blur-md border border-white/20' 
                  : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg'
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">Upload New Photos</h3>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                  }`}>
                    <Plus className="w-5 h-5" />
                    <span>{uploading ? 'Uploading...' : 'Choose Photos'}</span>
                  </div>
                </label>
                {uploading && (
                  <div className="flex items-center space-x-2 text-sm opacity-70">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Photos Grid */}
            {travelPictures.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No Photos Yet</h3>
                <p className="text-lg opacity-70 mb-6">Start sharing your travel memories!</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>Upload Your First Photo</span>
                  </div>
                </label>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {travelPictures.map((photo) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`group relative overflow-hidden rounded-2xl shadow-lg ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                    }`}
                  >
                    <div className="relative aspect-square">
                      <img
                        src={photo.url}
                        alt={photo.description || 'Travel photo'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Delete Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeletePhoto(photo.id, photo.filePath)}
                        disabled={deletingPhoto === photo.id}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                          deletingPhoto === photo.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                        }`}
                      >
                        {deletingPhoto === photo.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                    
                    <div className="p-4">
                      <p className="font-medium text-sm mb-2 line-clamp-2">
                        {photo.description || 'Untitled'}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(photo.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Public</span>
                        </div>
                      </div>
                      
                      {photo.location && (
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{photo.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                          <span className="text-sm font-medium">{photo.likes}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;