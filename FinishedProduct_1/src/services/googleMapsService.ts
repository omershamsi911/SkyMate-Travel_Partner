// Google Maps API service for restaurants, hotels, and points of interest
export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  photos?: string[];
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  vicinity?: string;
  website?: string;
  phone_number?: string;
}

export interface PlacesSearchParams {
  location: string;
  radius?: number;
  type?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  openNow?: boolean;
}

// Note: You'll need to add your Google Maps API key to your environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export class GoogleMapsService {
  private static baseUrl = 'https://maps.googleapis.com/maps/api';

  // Search for places (restaurants, hotels, etc.)
  static async searchPlaces(params: PlacesSearchParams): Promise<Place[]> {
    try {
      const searchParams = new URLSearchParams({
        location: params.location,
        radius: params.radius?.toString() || '5000',
        type: params.type || 'restaurant',
        key: GOOGLE_MAPS_API_KEY,
        ...(params.keyword && { keyword: params.keyword }),
        ...(params.minPrice && { minprice: params.minPrice.toString() }),
        ...(params.maxPrice && { maxprice: params.maxPrice.toString() }),
        ...(params.openNow && { opennow: 'true' })
      });

      const response = await fetch(
        `${this.baseUrl}/place/nearbysearch/json?${searchParams}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Maps API error: ${data.status}`);
      }

      return data.results || [];
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  // Get place details
  static async getPlaceDetails(placeId: string): Promise<Place | null> {
    try {
      const searchParams = new URLSearchParams({
        place_id: placeId,
        fields: 'place_id,name,formatted_address,rating,user_ratings_total,price_level,types,photos,opening_hours,geometry,vicinity,website,phone_number',
        key: GOOGLE_MAPS_API_KEY
      });

      const response = await fetch(
        `${this.baseUrl}/place/details/json?${searchParams}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Google Maps API error: ${data.status}`);
      }

      return data.result;
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  // Search for restaurants
  static async searchRestaurants(location: string, radius: number = 5000): Promise<Place[]> {
    return this.searchPlaces({
      location,
      radius,
      type: 'restaurant'
    });
  }

  // Search for hotels
  static async searchHotels(location: string, radius: number = 5000): Promise<Place[]> {
    return this.searchPlaces({
      location,
      radius,
      type: 'lodging'
    });
  }

  // Search for attractions
  static async searchAttractions(location: string, radius: number = 5000): Promise<Place[]> {
    return this.searchPlaces({
      location,
      radius,
      type: 'tourist_attraction'
    });
  }

  // Search for shopping
  static async searchShopping(location: string, radius: number = 5000): Promise<Place[]> {
    return this.searchPlaces({
      location,
      radius,
      type: 'shopping_mall'
    });
  }

  // Get photo URL for a place
  static getPlacePhotoUrl(photoReference: string, maxWidth: number = 400): string {
    return `${this.baseUrl}/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
  }

  // Get static map URL
  static getStaticMapUrl(
    center: string,
    zoom: number = 13,
    size: string = '600x400',
    markers?: string[]
  ): string {
    const params = new URLSearchParams({
      center,
      zoom: zoom.toString(),
      size,
      key: GOOGLE_MAPS_API_KEY
    });

    if (markers && markers.length > 0) {
      markers.forEach(marker => {
        params.append('markers', marker);
      });
    }

    return `${this.baseUrl}/staticmap?${params}`;
  }

  // Geocode address to coordinates
  static async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const searchParams = new URLSearchParams({
        address,
        key: GOOGLE_MAPS_API_KEY
      });

      const response = await fetch(
        `${this.baseUrl}/geocode/json?${searchParams}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error(`Geocoding failed: ${data.status}`);
      }

      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Reverse geocode coordinates to address
  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const searchParams = new URLSearchParams({
        latlng: `${lat},${lng}`,
        key: GOOGLE_MAPS_API_KEY
      });

      const response = await fetch(
        `${this.baseUrl}/geocode/json?${searchParams}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error(`Reverse geocoding failed: ${data.status}`);
      }

      return data.results[0].formatted_address;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }
}

// Mock data for development/testing when API key is not available
export const mockPlaces: Place[] = [
  {
    place_id: 'mock_1',
    name: 'Skyline Restaurant',
    formatted_address: '123 Main St, New York, NY 10001',
    rating: 4.5,
    user_ratings_total: 1250,
    price_level: 3,
    types: ['restaurant', 'food', 'establishment'],
    geometry: {
      location: { lat: 40.7128, lng: -74.0060 }
    },
    vicinity: 'Manhattan'
  },
  {
    place_id: 'mock_2',
    name: 'Grand Hotel',
    formatted_address: '456 Park Ave, New York, NY 10022',
    rating: 4.8,
    user_ratings_total: 890,
    price_level: 4,
    types: ['lodging', 'establishment'],
    geometry: {
      location: { lat: 40.7589, lng: -73.9851 }
    },
    vicinity: 'Midtown'
  },
  {
    place_id: 'mock_3',
    name: 'Central Park',
    formatted_address: 'Central Park, New York, NY',
    rating: 4.7,
    user_ratings_total: 15420,
    types: ['tourist_attraction', 'park', 'establishment'],
    geometry: {
      location: { lat: 40.7829, lng: -73.9654 }
    },
    vicinity: 'Manhattan'
  }
]; 