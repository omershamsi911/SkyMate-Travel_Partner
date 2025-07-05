import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Loader2, Search, MapPin, ChevronLeft, ChevronRight, User, Calendar, MapPin as MapPinIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../config/supabase';

interface TravelPhoto {
  id: string;
  image_url: string;
  description: string;
  location?: string;
  created_at: string;
  likes: number;
  user_id: string;
}

const CommunityPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<TravelPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<TravelPhoto | null>(null);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [likingInProgress, setLikingInProgress] = useState<Set<string>>(new Set());
  const photosPerPage = 12;
  const { theme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data: photoData, error } = await supabase
        .from('user_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedPhotos = photoData.map((photo) => {
        let imageUrl = photo.url;
        if (!imageUrl && photo.file_path) {
          const { data: { publicUrl } } = supabase.storage
            .from('travel-pictures')
            .getPublicUrl(photo.file_path);
          imageUrl = publicUrl;
        }
        return {
          id: photo.id,
          image_url: imageUrl,
          description: photo.description || '',
          location: photo.location || '',
          created_at: photo.created_at,
          likes: photo.likes || 0,
          user_id: photo.user_id
        };
      });

      setPhotos(processedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_likes')
        .select('photo_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const likedPhotoIds = new Set(data.map(like => like.photo_id));
      setUserLikes(likedPhotoIds);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const toggleLike = async (photoId: string) => {
    if (!user || likingInProgress.has(photoId)) return;
    
    setLikingInProgress(prev => new Set(prev).add(photoId));
    
    try {
      const isLiked = userLikes.has(photoId);
      const photoIdInt = parseInt(photoId);
      
      if (isLiked) {
        // Unlike the photo
        const { error: deleteError } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('photo_id', photoIdInt);
        
        if (deleteError) throw deleteError;
        
        // Get current likes count and decrement
        const { data: photoData, error: fetchError } = await supabase
          .from('user_photos')
          .select('likes')
          .eq('id', photoIdInt)
          .single();
        
        if (fetchError) throw fetchError;
        
        const { error: updateError } = await supabase
          .from('user_photos')
          .update({ likes: Math.max(0, photoData.likes - 1) })
          .eq('id', photoIdInt);
        
        if (updateError) throw updateError;
        
        // Update local state
        setUserLikes(prev => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
        
        // Update photo likes count
        setPhotos(prev => prev.map(photo => 
          photo.id === photoId 
            ? { ...photo, likes: Math.max(0, photo.likes - 1) }
            : photo
        ));
      } else {
        // Like the photo
        const { error: insertError } = await supabase
          .from('user_likes')
          .insert({
            user_id: user.id,
            photo_id: photoIdInt
          });
        
        if (insertError) throw insertError;
        
        // Get current likes count and increment
        const { data: photoData, error: fetchError } = await supabase
          .from('user_photos')
          .select('likes')
          .eq('id', photoIdInt)
          .single();
        
        if (fetchError) throw fetchError;
        
        const { error: updateError } = await supabase
          .from('user_photos')
          .update({ likes: photoData.likes + 1 })
          .eq('id', photoIdInt);
        
        if (updateError) throw updateError;
        
        // Update local state
        setUserLikes(prev => new Set(prev).add(photoId));
        
        // Update photo likes count
        setPhotos(prev => prev.map(photo => 
          photo.id === photoId 
            ? { ...photo, likes: photo.likes + 1 }
            : photo
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Refresh photos to ensure consistency
      fetchPhotos();
    } finally {
      setLikingInProgress(prev => {
        const newSet = new Set(prev);
        newSet.delete(photoId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchUserLikes();
  }, [user]);

  const filteredPhotos = photos.filter(photo => {
    const desc = photo.description?.toLowerCase() || '';
    const loc = photo.location?.toLowerCase() || '';
    return (
      desc.includes(searchTerm.toLowerCase()) &&
      (!filterLocation || loc.includes(filterLocation.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * photosPerPage,
    currentPage * photosPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    if (selectedPhoto) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedPhoto]);

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-slate-50 text-slate-800'
    }`}>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Gallery</span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Explore stunning travel photos shared by our community
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`max-w-4xl mx-auto p-6 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-white/10 backdrop-blur-md border-white/20' 
                : 'bg-white/80 backdrop-blur-md border-white/40 shadow-xl'
            } border mb-8`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search photo descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-white/20 border-white/30 text-white placeholder-gray-300'
                      : 'bg-white/90 border-gray-200 text-slate-800 placeholder-gray-500'
                  }`}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark'
                      ? 'bg-white/20 border-white/30 text-white placeholder-gray-300'
                      : 'bg-white/90 border-gray-200 text-slate-800 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}
            >
              {paginatedPhotos.map(photo => (
                <motion.div
                  key={photo.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className={`group relative overflow-hidden rounded-2xl shadow-lg ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                  }`}
                  onClick={() =>setSelectedPhoto(photo)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={photo.image_url}
                      alt={photo.description}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4">
                    <p className="font-medium text-sm mb-2 line-clamp-2">{photo.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3" />
                        <span>{photo.user_id}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(photo.created_at)}</span>
                      </div>
                    </div>
                    {photo.location && (
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        <span>{photo.location}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(photo.id);
                        }}
                        disabled={!user || likingInProgress.has(photo.id)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                          !user 
                            ? 'cursor-not-allowed opacity-50' 
                            : userLikes.has(photo.id)
                              ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            userLikes.has(photo.id) ? 'fill-current' : ''
                          }`} 
                        />
                        <span className="text-sm font-medium">{photo.likes}</span>
                        {likingInProgress.has(photo.id) && (
                          <Loader2 className="w-3 h-3 animate-spin ml-1" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`max-w-4xl max-h-[90vh] w-full rounded-2xl overflow-hidden ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={selectedPhoto.image_url}
                    alt={selectedPhoto.description}
                    className="w-full max-h-[70vh] object-contain"
                  />
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    X
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{selectedPhoto.description}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{selectedPhoto.user_id}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedPhoto.created_at)}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleLike(selectedPhoto.id)}
                      disabled={!user || likingInProgress.has(selectedPhoto.id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
                        !user 
                          ? 'cursor-not-allowed opacity-50' 
                          : userLikes.has(selectedPhoto.id)
                            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          userLikes.has(selectedPhoto.id) ? 'fill-current' : ''
                        }`} 
                      />
                      <span className="font-medium">{selectedPhoto.likes}</span>
                      {likingInProgress.has(selectedPhoto.id) && (
                        <Loader2 className="w-4 h-4 animate-spin ml-1" />
                      )}
                    </motion.button>
                                      </div>
                  {selectedPhoto.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      <span>{selectedPhoto.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CommunityPhotos;
