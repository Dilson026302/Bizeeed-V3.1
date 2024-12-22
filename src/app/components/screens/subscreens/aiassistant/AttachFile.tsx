import React, { useState } from "react";
import { FaPaperclip } from "react-icons/fa";
import { supabase } from "../../../../utils/supabaseClient";

interface AttachFileProps {
  onFileUpload: (fileUrl: string, fileName: string) => void;
  bucketName: string;
}

const AttachFile: React.FC<AttachFileProps> = ({ onFileUpload, bucketName }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Fetch the current user ID
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user?.id) {
        throw new Error("User is not authenticated or user ID is missing.");
      }

      const userId = user.user.id;

      // Create file path dynamically inside the user's folder
      const filePath = `${userId}/${Date.now()}_${file.name}`;

      // Upload the file to Supabase bucket
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Pass the public URL and file name back to the parent component
      onFileUpload(publicUrl, file.name);
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="attach-file">
      <label htmlFor="file-input" style={{ cursor: "pointer" }}>
        <FaPaperclip size={20} className="icon-button" />
      </label>
      <input
        id="file-input"
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
};

export default AttachFile;
