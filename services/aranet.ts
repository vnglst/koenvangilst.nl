const SUPABASE_URL = process.env.SUPABASE_ARANET_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ARANET_ANON_KEY;

import { createClient } from '@supabase/supabase-js';

export type Co2Reading = {
  timestamp: number;
  co2: number;
  temperature: number;
  humidity: number;
  pressure: number;
};

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

export async function getLastReading() {
  const { data, error } = await supabase.from('readings').select('*').order('timestamp', { ascending: false }).limit(1);

  if (error) {
    throw new Error('Error fetching readings', { cause: error });
  }

  if (!data[0]) {
    return null;
  }

  return data[0] as Co2Reading;
}
