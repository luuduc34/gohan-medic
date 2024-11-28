import { supabase } from '../lib/supabaseClient';

export async function fetchPromotions() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_promotion', true);
  if (error) throw error;
  return data;
}
