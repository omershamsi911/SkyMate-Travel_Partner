-- Database setup for SkyMate application
-- Run these SQL commands in your Supabase SQL editor

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_id UUID NOT NULL REFERENCES user_photos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, photo_id)
);

-- Create user_photos table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    description TEXT,
    location TEXT,
    tags TEXT[],
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_photo_id ON likes(photo_id);
CREATE INDEX IF NOT EXISTS idx_user_photos_user_id ON user_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_photos_created_at ON user_photos(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for likes table
CREATE POLICY "Users can view all likes" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_photos table
CREATE POLICY "Users can view all photos" ON user_photos
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own photos" ON user_photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" ON user_photos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" ON user_photos
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_photo_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE user_photos 
        SET likes = likes + 1 
        WHERE id = NEW.photo_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE user_photos 
        SET likes = likes - 1 
        WHERE id = OLD.photo_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update likes count
CREATE TRIGGER update_photo_likes_trigger
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION update_photo_likes_count();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 