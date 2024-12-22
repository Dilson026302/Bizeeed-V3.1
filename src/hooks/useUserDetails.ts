import { useState, useEffect } from "react";
import { supabase } from "../app/utils/supabaseClient";

// Interface for defining the structure of user details
export interface UserDetails {
  email: string;
  username?: string;
  fullName?: string;
  profilePicture?: string;
  role?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  lastLogin?: string;
}

// Hook to manage fetching and updating user details
const useUserDetails = () => {
  const [user, setUser] = useState<UserDetails | null>(null); // State to store user details
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch user details when the hook is used
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser(); // Fetch user from Supabase
        if (error) throw new Error(error.message);

        const userMetadata = data?.user?.user_metadata || {}; // Extract user metadata
        const userData: UserDetails = {
          email: data?.user?.email || "Unknown",
          username: userMetadata.username || "Guest",
          fullName: userMetadata.fullName || "No Name",
          profilePicture: userMetadata.profilePicture || "",
          role: userMetadata.role || "User",
          phone: userMetadata.phone || "No Phone",
          address: userMetadata.address || "No Address",
          createdAt: new Date(data?.user?.created_at || "").toLocaleDateString(),
          lastLogin: new Date(userMetadata.lastLogin || "").toLocaleDateString(),
        };

        setUser(userData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Save updated user details to Supabase
  const saveUpdatedDetails = async (updatedUser: UserDetails) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: {
          fullName: updatedUser.fullName,
          phone: updatedUser.phone,
          address: updatedUser.address,
          profilePicture: updatedUser.profilePicture,
        },
      });

      if (error) throw new Error(error.message);
      setUser(updatedUser); // Update local state with new user details
    } catch (err: any) {
      setError(err.message || "Failed to update user details.");
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture to Supabase storage
  const uploadProfilePicture = async (file: File): Promise<string> => {
    try {
      setLoading(true);
      if (!user?.email) throw new Error("User email is required for file upload.");

      const fileName = `avatars/${user.email}/${file.name}`; // Define storage path for the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("app-icons")
        .upload(fileName, file, { upsert: true }); // Upload the file to Supabase storage

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicURLData } = supabase.storage
        .from("app-icons")
        .getPublicUrl(fileName); // Get public URL for the uploaded file

      if (!publicURLData?.publicUrl) {
        throw new Error("Unable to retrieve public URL for uploaded file.");
      }

      const publicURL = publicURLData.publicUrl;

      const updateResponse = await supabase.auth.updateUser({
        data: { profilePicture: publicURL }, // Update user metadata with the profile picture URL
      });

      if (updateResponse.error) {
        throw new Error(updateResponse.error.message);
      }

      return publicURL;
    } catch (err: any) {
      setError(err.message || "Failed to upload profile picture.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, saveUpdatedDetails, uploadProfilePicture };
};

export default useUserDetails;
