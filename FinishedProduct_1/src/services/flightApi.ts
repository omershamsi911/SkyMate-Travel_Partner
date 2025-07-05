// services/flightApi.ts
import { format } from 'date-fns';
import supabase from '../config/supabase';

export interface Airport {
  id: string;
  iata_code: string;
  name: string;
  city: string;
  country: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  stops: number;
  status: string;
  basePrice: number;
  price: number;
  flightDate?: string;
}

export interface Booking {
  id: string;
  flight: Flight;
  status: string;
  passengers: Array<{
    firstName: string;
    lastName: string;
    passportNumber: string;
  }>;
  totalPrice: number;
  bookingDate: string;
  ticketNumber?: string;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export const searchFlights = async (criteria: {
  from: string;
  to: string;
  date: string;
}): Promise<Flight[]> => {
  const { from, to, date } = criteria;

  const { data, error } = await supabase
    .from('flights')
    .select(`
      id,
      flight_number,
      departure_datetime,
      arrival_datetime,
      base_price,
      aircraft,
      stops,
      status,
      airlines(name),
      departure_airports:departure_airport_id(city, iata_code),
      arrival_airports:arrival_airport_id(city, iata_code)
    `)
    .gte('departure_datetime', `${date}T00:00:00Z`)
    .lt('departure_datetime', `${date}T23:59:59Z`)
    .ilike('departure_airports.city', `%${from}%`)
    .ilike('arrival_airports.city', `%${to}%`);

  if (error) throw error;

  return (data ?? []).map(flight => {
    const departure = new Date(flight.departure_datetime);
    const arrival = new Date(flight.arrival_datetime);
    const durationSeconds = (arrival.getTime() - departure.getTime()) / 1000;

    return {
      id: flight.id,
      flightNumber: flight.flight_number,
      airline: (flight.airlines as any)?.name || 'Unknown',
      departure: (flight.departure_airports as any)?.city || 'Unknown',
      departureAirport: (flight.departure_airports as any)?.iata_code || 'Unknown',
      arrival: (flight.arrival_airports as any)?.city || 'Unknown',
      arrivalAirport: (flight.arrival_airports as any)?.iata_code || 'Unknown',
      departureTime: format(departure, 'HH:mm'),
      arrivalTime: format(arrival, 'HH:mm'),
      duration: formatDuration(durationSeconds),
      aircraft: flight.aircraft,
      stops: flight.stops,
      status: flight.status,
      basePrice: parseFloat(flight.base_price),
      price: parseFloat(flight.base_price) // Base price without discount
    };
  });
};

export const getFlightById = async (id: string): Promise<Flight | null> => {
  const { data, error } = await supabase
    .from('flights')
    .select(`
      id,
      flight_number,
      departure_datetime,
      arrival_datetime,
      base_price,
      aircraft,
      stops,
      status,
      deal_id,
      airlines(name),
      departure_airports:departure_airport_id(city, iata_code),
      arrival_airports:arrival_airport_id(city, iata_code),
      deals(discount_percentage, valid_until)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const departure = new Date(data.departure_datetime);
  const arrival = new Date(data.arrival_datetime);
  const durationSeconds = (arrival.getTime() - departure.getTime()) / 1000;

  const discount = (data.deals as any)?.valid_until > new Date().toISOString()
    ? data.base_price * ((data.deals as any).discount_percentage / 100)
    : 0;

  return {
    id: data.id,
    flightNumber: data.flight_number,
    airline: (data.airlines as any)?.name || 'Unknown',
    departure: (data.departure_airports as any)?.city || 'Unknown',
    departureAirport: (data.departure_airports as any)?.iata_code || 'Unknown',
    arrival: (data.arrival_airports as any)?.city || 'Unknown',
    arrivalAirport: (data.arrival_airports as any)?.iata_code || 'Unknown',
    departureTime: format(departure, 'HH:mm'),
    arrivalTime: format(arrival, 'HH:mm'),
    duration: formatDuration(durationSeconds),
    aircraft: data.aircraft,
    stops: data.stops,
    status: data.status,
    basePrice: parseFloat(data.base_price),
    price: parseFloat((data.base_price - discount).toFixed(2)),
  };
};

export const bookFlight = async (bookingDetails: {
  flightId: string;
  passengerCount: number;
  passengers: any[];
  contactInfo: any;
}) => {
  const flight = await getFlightById(bookingDetails.flightId);
  if (!flight) throw new Error('Flight not found');

  const totalPrice = flight.price * bookingDetails.passengerCount;

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert([{
      user_id: 'current_user_id', // Replace with actual user ID
      flight_id: bookingDetails.flightId,
      total_price: totalPrice,
      passenger_count: bookingDetails.passengerCount,
      status: 'CONFIRMED',
      ticket_number: `TK-${Date.now()}`,
      contact_info: bookingDetails.contactInfo,
    }])
    .select('id')
    .single();

  if (bookingError) throw bookingError;

  for (const passenger of bookingDetails.passengers) {
    const { error: passengerError } = await supabase
      .from('passengers')
      .insert([{
        booking_id: booking.id,
        first_name: passenger.firstName,
        last_name: passenger.lastName,
        date_of_birth: passenger.dateOfBirth,
        passport_number: passenger.passportNumber,
        nationality: passenger.nationality,
      }]);

    if (passengerError) throw passengerError;
  }

  return { id: booking.id };
};

export const getUpcomingFlights = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      total_price,
      booking_date,
      flight:flights(
        id,
        flight_number,
        departure_datetime,
        arrival_datetime,
        base_price,
        aircraft,
        stops,
        status,
        airlines(name),
        departure_airports:departure_airport_id(city, iata_code),
        arrival_airports:arrival_airport_id(city, iata_code)
      ),
      passengers(first_name, last_name, passport_number)
    `)
    .gte('flight.departure_datetime', new Date().toISOString())
    .order('flight.departure_datetime', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(booking => {
    const flight = booking.flight as any;
    const departure = new Date(flight.departure_datetime);
    const arrival = new Date(flight.arrival_datetime);
    const durationSeconds = (arrival.getTime() - departure.getTime()) / 1000;

    return {
      id: booking.id,
      flight: {
        id: flight.id,
        flightNumber: flight.flight_number,
        airline: (flight.airlines as any)?.name || 'Unknown',
        departure: (flight.departure_airports as any)?.city || 'Unknown',
        departureAirport: (flight.departure_airports as any)?.iata_code || 'Unknown',
        arrival: (flight.arrival_airports as any)?.city || 'Unknown',
        arrivalAirport: (flight.arrival_airports as any)?.iata_code || 'Unknown',
        departureTime: format(departure, 'HH:mm'),
        arrivalTime: format(arrival, 'HH:mm'),
        duration: formatDuration(durationSeconds),
        aircraft: flight.aircraft,
        stops: flight.stops,
        status: flight.status,
        basePrice: parseFloat(flight.base_price),
        price: parseFloat(flight.base_price)
      },
      status: booking.status.toLowerCase(),
      passengers: (booking.passengers as any[] || []).map(p => ({
        firstName: p.first_name,
        lastName: p.last_name,
        passportNumber: p.passport_number
      })),
      totalPrice: parseFloat(booking.total_price),
      bookingDate: booking.booking_date
    };
  });
};

export const getUserWishlist = async (userId: string): Promise<Flight[]> => {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      flight:flights(
        id,
        flight_number,
        departure_datetime,
        arrival_datetime,
        base_price,
        aircraft,
        stops,
        status,
        airlines(name),
        departure_airports:departure_airport_id(city, iata_code),
        arrival_airports:arrival_airport_id(city, iata_code)
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;

  return (data ?? []).map(item => {
    const flight = item.flight as any;
    const departure = new Date(flight.departure_datetime);
    const arrival = new Date(flight.arrival_datetime);
    const durationSeconds = (arrival.getTime() - departure.getTime()) / 1000;

    return {
      id: flight.id,
      flightNumber: flight.flight_number,
      airline: (flight.airlines as any)?.name || 'Unknown',
      departure: (flight.departure_airports as any)?.city || 'Unknown',
      departureAirport: (flight.departure_airports as any)?.iata_code || 'Unknown',
      arrival: (flight.arrival_airports as any)?.city || 'Unknown',
      arrivalAirport: (flight.arrival_airports as any)?.iata_code || 'Unknown',
      departureTime: format(departure, 'HH:mm'),
      arrivalTime: format(arrival, 'HH:mm'),
      duration: formatDuration(durationSeconds),
      aircraft: flight.aircraft,
      stops: flight.stops,
      status: flight.status,
      basePrice: parseFloat(flight.base_price),
      price: parseFloat(flight.base_price)
    };
  });
};

export const removeFromWishlist = async (userId: string, flightId: string): Promise<void> => {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('flight_id', flightId);

  if (error) throw error;
};

export const searchAirports = async (query: string): Promise<Airport[]> => {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase
    .from('airports')
    .select('id, iata_code, name, city, country')
    .or(`city.ilike.%${query}%,iata_code.ilike.%${query}%,name.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching airports:', error);
    return [];
  }

  return data || [];
};

export const getFlightHistory = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      total_price,
      booking_date,
      ticket_number,
      flight:flights(
        id,
        flight_number,
        departure_datetime,
        arrival_datetime,
        base_price,
        aircraft,
        stops,
        status,
        airlines(name),
        departure_airports:departure_airport_id(city, iata_code),
        arrival_airports:arrival_airport_id(city, iata_code)
      )
    `)
    .order('booking_date', { ascending: false });

  if (error) throw error;

  return (data ?? []).map(booking => {
    const flight = booking.flight as any;
    const departure = new Date(flight.departure_datetime);
    const arrival = new Date(flight.arrival_datetime);
    const durationSeconds = (arrival.getTime() - departure.getTime()) / 1000;

    return {
      id: booking.id,
      status: booking.status,
      totalPrice: parseFloat(booking.total_price),
      bookingDate: booking.booking_date,
      ticketNumber: booking.ticket_number,
      flight: {
        id: flight.id,
        flightNumber: flight.flight_number,
        airline: flight.airlines?.name || 'Unknown',
        departure: flight.departure_airports?.city || 'Unknown',
        departureAirport: flight.departure_airports?.iata_code || 'Unknown',
        arrival: flight.arrival_airports?.city || 'Unknown',
        arrivalAirport: flight.arrival_airports?.iata_code || 'Unknown',
        departureTime: format(departure, 'HH:mm'),
        arrivalTime: format(arrival, 'HH:mm'),
        duration: formatDuration(durationSeconds),
        aircraft: flight.aircraft,
        stops: flight.stops,
        status: flight.status,
        basePrice: parseFloat(flight.base_price),
        price: parseFloat(flight.base_price),
        flightDate: flight.departure_datetime.split('T')[0]
      },
      passengers: []
    };
  });
};