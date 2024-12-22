import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key in environment variables.');
}

// Initialize Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Define user details interface
export interface UserDetails {
  email: string;
  username?: string;
}

/**
 * Fetch authenticated user details.
 * @returns {Promise<UserDetails | null>} User details or null if not authenticated.
 */
export const getUserDetails = async (): Promise<UserDetails | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error('Error fetching user details:', error?.message);
      return null;
    }

    const user: User = data.user;

    return {
      email: user.email || 'Unknown',
      username: user.user_metadata?.username || 'Guest',
    };
  } catch (err) {
    console.error('Unexpected error fetching user details:', err);
    return null;
  }
};
