import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, MapPin, Percent, DollarSign, Tag, ArrowRight } from 'lucide-react';
import supabase from '../config/supabase';

type Deal = {
  id: string;
  code: string;
  description?: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  valid_until: string;
  airline?: {
    name: string;
    iata_code: string;
  };
  origin_airport?: {
    name: string;
    city: string;
    country: string;
    iata_code: string;
  };
  destination_airport?: {
    name: string;
    city: string;
    country: string;
    iata_code: string;
  };
  [key: string]: any;
};


const DealsComponent = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current date for filtering valid deals
      const today = new Date().toISOString().split('T')[0];

      // Query deals with related airline and airport information
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select(`
          *,
          airline:airlines(name, iata_code),
          origin_airport:airports!deals_origin_airport_id_fkey(name, city, country, iata_code),
          destination_airport:airports!deals_destination_airport_id_fkey(name, city, country, iata_code)
        `)
        .lte('valid_from', today)
        .gte('valid_until', today)
        .order('created_at', { ascending: false });

      if (dealsError) {
        throw dealsError;
      }

      setDeals(dealsData || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseDeal = (deal: Deal) => {
    const params = new URLSearchParams({
      dealCode: deal.code,
      discountType: deal.discount_type,
      discountValue: deal.discount_value.toString(),
      validUntil: deal.valid_until
    });

    // Add route-specific parameters
    if (deal.origin_airport) {
      params.set('origin', deal.origin_airport.iata_code);
    }
    if (deal.destination_airport) {
      params.set('destination', deal.destination_airport.iata_code);
    }
    if (deal.airline) {
      params.set('airline', deal.airline.iata_code);
    }

    // Redirect to bookings page
    navigate(`/bookings?${params.toString()}`);
  };



  const formatDiscountValue = (deal: Deal) => {
    if (deal.discount_type === 'PERCENTAGE') {
      return `${deal.discount_value}% OFF`;
    } else {
      return `$${deal.discount_value} OFF`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDealScope = (deal: Deal) => {
    if (deal.airline && deal.origin_airport && deal.destination_airport) {
      return `${deal.airline.name} flights from ${deal.origin_airport.city} to ${deal.destination_airport.city}`;
    } else if (deal.airline) {
      return `All ${deal.airline.name} flights`;
    } else if (deal.origin_airport && deal.destination_airport) {
      return `Flights from ${deal.origin_airport.city} to ${deal.destination_airport.city}`;
    } else if (deal.origin_airport) {
      return `Flights from ${deal.origin_airport.city}`;
    } else if (deal.destination_airport) {
      return `Flights to ${deal.destination_airport.city}`;
    }
    return 'All flights';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-900/60 backdrop-blur-md border border-red-700/50 rounded-xl p-6">
            <div className="text-center">
              <div className="text-xl font-bold mb-2">Error loading deals</div>
              <div className="text-red-300">{error}</div>
              <button
                onClick={fetchDeals}
                className="mt-4 bg-gradient-to-r from-purple-700 to-indigo-700 px-6 py-2 rounded-lg font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-300">
            Exclusive Flight Deals
          </h1>
          <p className="text-indigo-300 max-w-2xl mx-auto">
            Discover limited-time offers on flights to amazing destinations. Book now before these deals expire!
          </p>
        </div>

        {deals.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-indigo-900/50 p-8 text-center">
            <Plane className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Current Deals</h3>
            <p className="text-indigo-300">Check back soon for new flight deals!</p>
            <button
              onClick={fetchDeals}
              className="mt-4 bg-gradient-to-r from-purple-800 to-indigo-800 px-6 py-2 rounded-lg font-medium"
            >
              Refresh Deals
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-gray-800/40 backdrop-blur-md rounded-xl border border-indigo-900/50 hover:border-indigo-500/50 transition-all duration-300 shadow-lg shadow-indigo-900/20"
              >
                <div className="p-6">
                  {/* Deal Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-indigo-400 mr-2" />
                      <span className="font-bold text-lg text-indigo-300">{deal.code}</span>
                    </div>
                    <div className="flex ml-4 items-center bg-gradient-to-r from-purple-700 to-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                      {deal.discount_type === 'PERCENTAGE' ? (
                        <Percent className="h-4 w-4 mr-1" />
                      ) : (
                        <DollarSign className="h-4 w-4 mr-1" />
                      )}
                      {formatDiscountValue(deal)}
                    </div>
                  </div>

                  {/* Deal Description */}
                  {deal.description && (
                    <p className="text-indigo-200 mb-4 text-sm">{deal.description}</p>
                  )}

                  {/* Deal Scope */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-indigo-400 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="font-medium">Applies to:</span>
                    </div>
                    <p className="text-indigo-100 text-sm pl-5">{getDealScope(deal)}</p>
                  </div>

                  {/* Airline Info (without logo) */}
                  {deal.airline && (
                    <div className="mb-4 flex items-center">
                      <div className="bg-indigo-900/50 rounded-md p-2 mr-3">
                        <Plane className="h-5 w-5 text-indigo-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-indigo-100">
                          {deal.airline.name}
                        </div>
                        <div className="text-xs text-indigo-400">
                          {deal.airline.iata_code}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Route Information */}
                  {(deal.origin_airport || deal.destination_airport) && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        {deal.origin_airport && (
                          <div className="text-center">
                            <div className="font-bold text-white text-lg">
                              {deal.origin_airport.iata_code}
                            </div>
                            <div className="text-indigo-300">
                              {deal.origin_airport.city}
                            </div>
                          </div>
                        )}
                        {deal.origin_airport && deal.destination_airport && (
                          <div className="flex-1 flex justify-center">
                            <div className="relative">
                              <div className="h-px w-16 bg-indigo-700 absolute top-1/2 transform -translate-y-1/2"></div>
                              <Plane className="h-4 w-4 text-indigo-400 relative transform rotate-90" />
                            </div>
                          </div>
                        )}
                        {deal.destination_airport && (
                          <div className="text-center">
                            <div className="font-bold text-white text-lg">
                              {deal.destination_airport.iata_code}
                            </div>
                            <div className="text-indigo-300">
                              {deal.destination_airport.city}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Validity Period */}
                  <div className="border-t border-indigo-900/50 pt-4">
                    <div className="flex items-center justify-between text-sm text-indigo-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Valid until:</span>
                      </div>
                      <span className="font-medium text-indigo-200">
                        {formatDate(deal.valid_until)}
                      </span>
                    </div>
                  </div>

                  {/* Use Deal Button */}
                  <button 
                    onClick={() => handleUseDeal(deal)}
                    className="w-full bg-gradient-to-r from-indigo-700 to-violet-800 hover:from-indigo-600 hover:to-violet-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-lg shadow-indigo-900/30"
                  >
                    <span>Use Deal Code</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-16 text-center">
          <button
            onClick={fetchDeals}
            className="bg-gray-800/50 backdrop-blur-md border border-indigo-900/50 hover:bg-gray-700/40 px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-900/10"
          >
            Refresh Deals
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealsComponent;
