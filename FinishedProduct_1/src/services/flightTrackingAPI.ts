export interface FlightStatus {
  flight_number: string;
  airline: string;
  aircraft: string;
  departure: {
    airport: string;
    iata: string;
    icao: string;
    scheduled: string;
    estimated: string;
    actual: string;
    terminal: string;
    gate: string;
  };
  arrival: {
    airport: string;
    iata: string;
    icao: string;
    scheduled: string;
    estimated: string;
    actual: string;
    terminal: string;
    gate: string;
  };
  status: string;
  progress: number;
  altitude: number;
  speed: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  updated: string;
}

export interface FlightSearchResult {
  flight_number: string;
  airline: string;
  date: string;
  status: string;
  departure_airport: string;
  arrival_airport: string;
}

const FLIGHT_API_KEY = '685c076528309efa4cd480f0';
const FLIGHT_API_BASE = 'https://api.flightapi.io/airline';

export const trackFlightByNumber = async (
  flightNumber: string,
  airlineCode: string,
  date: string
): Promise<FlightStatus | null> => {
  try {
    const url = `${FLIGHT_API_BASE}/${FLIGHT_API_KEY}?num=${flightNumber}&name=${airlineCode}&date=${date}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch flight data');

    const data = await response.json();
    if (!Array.isArray(data) || data.length < 2) return null;

    const departure = data[0]?.departure?.[0];
    const arrival = data[1]?.arrival?.[0];

    const flightStatus: FlightStatus = {
      flight_number: `${airlineCode}${flightNumber}`,
      airline: airlineCode,
      aircraft: "Unknown",
      departure: {
        airport: departure?.['Airport:'] || 'Unknown',
        iata: '',
        icao: '',
        scheduled: departure?.['Scheduled Time:'] || '',
        estimated: '',
        actual: departure?.['Takeoff Time:'] || '',
        terminal: departure?.['Terminal - Gate:']?.split(' - ')[0] || '',
        gate: departure?.['Terminal - Gate:']?.split(' - ')[1] || ''
      },
      arrival: {
        airport: arrival?.['Airport:'] || 'Unknown',
        iata: '',
        icao: '',
        scheduled: arrival?.['Scheduled Time:'] || '',
        estimated: '',
        actual: arrival?.['At Gate Time:'] || '',
        terminal: arrival?.['Terminal - Gate:']?.split(' - ')[0] || '',
        gate: arrival?.['Terminal - Gate:']?.split(' - ')[1] || ''
      },
      status: "Fetched",
      progress: 0,
      altitude: 0,
      speed: 0,
      coordinates: {
        latitude: 0,
        longitude: 0
      },
      updated: new Date().toISOString()
    };

    return flightStatus;
  } catch (error) {
    console.error('Error tracking flight:', error);
    return null;
  }
};

export const searchFlights = async (query: string): Promise<FlightSearchResult[]> => {
  try {
    // Mock search results (you can replace this with your own search endpoint later)
    const mockResults: FlightSearchResult[] = [
      {
        flight_number: "EK524",
        airline: "Emirates",
        date: "2025-06-25",
        status: "En Route",
        departure_airport: "DXB",
        arrival_airport: "LHR"
      },
      {
        flight_number: "BA159",
        airline: "British Airways",
        date: "2025-06-25",
        status: "Scheduled",
        departure_airport: "LHR",
        arrival_airport: "JFK"
      },
      {
        flight_number: "LH441",
        airline: "Lufthansa",
        date: "2025-06-25",
        status: "Boarding",
        departure_airport: "FRA",
        arrival_airport: "DXB"
      }
    ].filter(flight =>
      flight.flight_number.toLowerCase().includes(query.toLowerCase()) ||
      flight.airline.toLowerCase().includes(query.toLowerCase())
    );

    await new Promise(resolve => setTimeout(resolve, 800));
    return mockResults;
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
};