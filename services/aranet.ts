const SUPABASE_URL = process.env.SUPABASE_ARANET_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ARANET_ANON_KEY;

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

export async function getLastReading() {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(2);

  if (error) {
    console.error('Fetching readings failed', error);
    return null;
  }

  if (!data[0]) {
    return null;
  }

  return data[0];
}
