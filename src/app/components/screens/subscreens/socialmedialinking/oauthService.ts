import axios from "axios";
import { getOAuthConfig } from "./oauthConfig";

export const redirectToOAuth = (platform: string): void => {
  const config = getOAuthConfig(platform);

  if (!config) {
    console.error(`OAuth is not enabled or configured for ${platform}`);
    return;
  }

  const redirectUri = encodeURIComponent("https://vitejsvitezedxxwcw-r4oe--5173--c8c182a3.local-credentialless.webcontainer.io/dashboard/social-accounts");
  const state = Math.random().toString(36).substring(2);

  sessionStorage.setItem("oauth_state", state);
  sessionStorage.setItem("oauth_platform", platform);

  const authUrl = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(
    config.scope.join(" ")
  )}&state=${state}`;

  console.log("Redirect URL:", authUrl);
  window.location.href = authUrl;
};

// Add the missing exchangeToken function
export const exchangeToken = async (platform: string, code: string) => {
  const config = getOAuthConfig(platform);

  if (!config) {
    throw new Error(`OAuth configuration not found for platform: ${platform}`);
  }

  const payload = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: "https://vitejsvitezedxxwcw-r4oe--5173--c8c182a3.local-credentialless.webcontainer.io/dashboard/social-accounts",
  });

  try {
    const response = await axios.post(config.tokenUrl, payload.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data; // Token response from OAuth provider
  } catch (error) {
    console.error("Error exchanging token:", error);
    throw error;
  }
};
