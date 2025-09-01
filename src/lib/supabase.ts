import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { supabaseUrl, supabseAnonKey } from '../constants/constants';

const supabase = createClient(supabaseUrl, supabseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export default supabase;