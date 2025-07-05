import { supabase } from '../config/supabase';

export interface Like {
  id: string;
  user_id: string;
  photo_id: string;
  created_at: string;
}

export interface PhotoWithLikes {
  id: string;
  filePath: string;
  userId: string;
  description: string;
  location: string;
  tags: string[];
  createdAt: string;
  likes: number;
  isLikedByUser: boolean;
}

// Check if likes table exists
const checkLikesTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('likes')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.warn('Likes table does not exist yet:', error);
    return false;
  }
};

// Get likes count for a photo
export const getLikesCount = async (photoId: string): Promise<number> => {
  try {
    const tableExists = await checkLikesTableExists();
    if (!tableExists) {
      // Fallback to photo's likes field if table doesn't exist
      const { data: photo, error } = await supabase
        .from('user_photos')
        .select('likes')
        .eq('id', photoId)
        .single();
      
      if (error) throw error;
      return photo?.likes || 0;
    }

    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('photo_id', photoId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting likes count:', error);
    return 0;
  }
};

// Check if user has liked a photo
export const hasUserLiked = async (photoId: string, userId: string): Promise<boolean> => {
  try {
    const tableExists = await checkLikesTableExists();
    if (!tableExists) {
      return false; // If table doesn't exist, user hasn't liked anything
    }

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('photo_id', photoId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking if user liked:', error);
    return false;
  }
};

// Add like to a photo
export const addLike = async (photoId: string, userId: string): Promise<void> => {
  try {
    const tableExists = await checkLikesTableExists();
    if (!tableExists) {
      console.warn('Likes table does not exist. Please run the database setup SQL first.');
      return;
    }

    const { error } = await supabase
      .from('likes')
      .insert({
        photo_id: photoId,
        user_id: userId
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
};

// Remove like from a photo
export const removeLike = async (photoId: string, userId: string): Promise<void> => {
  try {
    const tableExists = await checkLikesTableExists();
    if (!tableExists) {
      console.warn('Likes table does not exist. Please run the database setup SQL first.');
      return;
    }

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('photo_id', photoId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing like:', error);
    throw error;
  }
};

// Toggle like (add if not liked, remove if liked)
export const toggleLike = async (photoId: string, userId: string): Promise<{ likes: number; isLiked: boolean }> => {
  try {
    const tableExists = await checkLikesTableExists();
    if (!tableExists) {
      console.warn('Likes table does not exist. Please run the database setup SQL first.');
      return { likes: 0, isLiked: false };
    }

    const isLiked = await hasUserLiked(photoId, userId);
    
    if (isLiked) {
      await removeLike(photoId, userId);
    } else {
      await addLike(photoId, userId);
    }

    const newLikesCount = await getLikesCount(photoId);
    return {
      likes: newLikesCount,
      isLiked: !isLiked
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Get all photos with likes information for a user
export const getPhotosWithLikes = async (userId?: string): Promise<PhotoWithLikes[]> => {
  try {
    const { data: photos, error: photosError } = await supabase
      .from('user_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (photosError) throw photosError;

    if (!photos) return [];

    const tableExists = await checkLikesTableExists();
    
    const photosWithLikes = await Promise.all(
      photos.map(async (photo) => {
        let likesCount = photo.likes || 0;
        let isLikedByUser = false;

        if (tableExists && userId) {
          likesCount = await getLikesCount(photo.id);
          isLikedByUser = await hasUserLiked(photo.id, userId);
        }

        return {
          ...photo,
          likes: likesCount,
          isLikedByUser
        };
      })
    );

    return photosWithLikes;
  } catch (error) {
    console.error('Error getting photos with likes:', error);
    return [];
  }
};

// Get user's liked photos
export const getUserLikedPhotos = async (userId: string): Promise<PhotoWithLikes[]> => {
  try {
    const tableExists = await checkLikesTableExists();
    if (!tableExists) {
      return []; // If table doesn't exist, no liked photos
    }

    const { data: likes, error: likesError } = await supabase
      .from('likes')
      .select('photo_id')
      .eq('user_id', userId);

    if (likesError) throw likesError;

    if (!likes || likes.length === 0) return [];

    const photoIds = likes.map(like => like.photo_id);
    
    const { data: photos, error: photosError } = await supabase
      .from('user_photos')
      .select('*')
      .in('id', photoIds)
      .order('created_at', { ascending: false });

    if (photosError) throw photosError;

    if (!photos) return [];

    const photosWithLikes = await Promise.all(
      photos.map(async (photo) => {
        const likesCount = await getLikesCount(photo.id);
        return {
          ...photo,
          likes: likesCount,
          isLikedByUser: true
        };
      })
    );

    return photosWithLikes;
  } catch (error) {
    console.error('Error getting user liked photos:', error);
    return [];
  }
}; 