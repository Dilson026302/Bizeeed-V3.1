import { useState, useEffect } from "react";
import { supabase } from "../app/utils/supabaseClient";

export const useFetch = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user details and metadata
  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      // Get user metadata and normalize structure
      const userMetadata = data?.user?.user_metadata || {};
      setUserDetails({
        email: data?.user?.email,
        ...userMetadata,
      });
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize user details on component mount
  useEffect(() => {
    fetchUser();
  }, []); // Dependency array ensures this runs only once

  const refreshUser = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      // Refresh user details after refreshing the session
      await fetchUser();
    } catch (err) {
      console.error("Error refreshing session:", err);
      setError("Failed to refresh user session.");
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserDetails(null); // Clear user details after logout
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to log out.");
    }
  };

  return { userDetails, loading, error, refreshUser, logout };
};
