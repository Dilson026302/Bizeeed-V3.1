import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ActivityIndicator, Image } from "react-native-web";
import Button from "../ui/Button"; // Updated button import
import useUserDetails, { UserDetails } from "../../../hooks/useUserDetails";

const MyAccount: React.FC = () => {
  const { user, loading, error, saveUpdatedDetails, uploadProfilePicture } = useUserDetails();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserDetails | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSaveProfilePicture = async () => {
    if (selectedFile) {
      try {
        const publicURL = await uploadProfilePicture(selectedFile);
        const updatedUserData = {
          ...updatedUser,
          profilePicture: publicURL,
        };
        await saveUpdatedDetails(updatedUserData as UserDetails);
      } catch (err) {
        console.error("Error uploading profile picture:", err);
      }
    }
  };

  const handleSaveDetails = async () => {
    if (updatedUser) {
      await saveUpdatedDetails(updatedUser);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={centeredContainer}>
        <ActivityIndicator size="large" color="#24a94a" />
        <Text style={loadingText}>Loading user details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={centeredContainer}>
        <Text style={errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={container}>
      <Text style={title}>My Account</Text>
      {updatedUser && (
        <>
          {updatedUser.profilePicture ? (
            <Image source={{ uri: updatedUser.profilePicture }} style={profilePicture} />
          ) : (
            <Text>No profile picture available</Text>
          )}

          {isEditing && (
            <>
              <input type="file" onChange={handleFileChange} />
              {selectedFile && (
                <Button
                  text="Upload Picture"
                  onClick={handleSaveProfilePicture}
                  className="upload-button"
                />
              )}
            </>
          )}

          {isEditing ? (
            <>
              <TextInput
                style={inputField}
                value={updatedUser?.fullName || ""}
                placeholder="Full Name"
                onChangeText={(text) =>
                  setUpdatedUser((prev) => (prev ? { ...prev, fullName: text } : null))
                }
              />
              <TextInput
                style={inputField}
                value={updatedUser?.phone || ""}
                placeholder="Phone"
                onChangeText={(text) =>
                  setUpdatedUser((prev) => (prev ? { ...prev, phone: text } : null))
                }
              />
              <TextInput
                style={inputField}
                value={updatedUser?.address || ""}
                placeholder="Address"
                onChangeText={(text) =>
                  setUpdatedUser((prev) => (prev ? { ...prev, address: text } : null))
                }
              />
              <Button text="Save" onClick={handleSaveDetails} className="save-button" />
              <Button
                text="Cancel"
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              />
            </>
          ) : (
            <>
              <Text style={infoText}>Full Name: {updatedUser.fullName}</Text>
              <Text style={infoText}>Email: {updatedUser.email}</Text>
              <Text style={infoText}>Phone: {updatedUser.phone}</Text>
              <Text style={infoText}>Address: {updatedUser.address}</Text>
              <Button
                text="Edit Profile"
                onClick={() => setIsEditing(true)}
                className="edit-button"
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

const container = {
  flex: 1,
  padding: 20,
  marginVertical: 60,
  marginHorizontal: 10,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderRadius: 10,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
};

const centeredContainer = {
  flex: 1,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const title = {
  fontSize: 28,
  fontWeight: "700" as const,
  marginBottom: 20,
  color: "#333",
};

const profilePicture = {
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: 20,
  borderWidth: 2,
  borderColor: "#24a94a",
  alignSelf: "center" as const,
};

const inputField = {
  width: "90%",
  padding: 12,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  marginBottom: 12,
  fontSize: 16,
  color: "#000",
  backgroundColor: "#fff",
};

const infoText = {
  fontSize: 16,
  marginBottom: 12,
  color: "#444",
};

const errorText = {
  color: "#ff4d4d",
  fontSize: 14,
  marginTop: 10,
  textAlign: "center" as const,
  fontWeight: "600" as const,
};

const loadingText = {
  marginTop: 10,
  fontSize: 14,
  color: "#666",
  fontStyle: "italic" as const,
};

export default MyAccount;
