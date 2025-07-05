import supabase from "../config/supabase";

export const applyFlightDeal = async (flightId: string) => {
  const { data: deal } = await supabase
    .from('deals')
    .select('*')
    .eq('type', 'flights')
    .eq('flight_id', flightId)
    .single();

  if (!deal) return null;

  return {
    ...deal,
    discountedPrice: deal.salePrice,
    originalPrice: deal.originalPrice
  };
};