export interface OAuthConfig {
  enabled: boolean; // Toggle this flag to enable/disable platforms
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  scope: string[];
}

export const oauthConfigs: Record<string, OAuthConfig> = {
  youtube: {
    enabled: true, // Only YouTube is enabled initially
    clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_YOUTUBE_CLIENT_SECRET || '',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: ['https://www.googleapis.com/auth/youtube.readonly'],
  },
  facebook: {
    enabled: false, // Set to true to enable Facebook
    clientId: '',
    clientSecret: '',
    authUrl: 'https://www.facebook.com/v10.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v10.0/oauth/access_token',
    scope: ['public_profile', 'email'],
  },
  instagram: {
    enabled: false,
    clientId: '',
    clientSecret: '',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scope: ['user_profile', 'user_media'],
  },
  tiktok: {
    enabled: false,
    clientId: '',
    clientSecret: '',
    authUrl: 'https://open-api.tiktok.com/oauth/authorize',
    tokenUrl: 'https://open-api.tiktok.com/oauth/access_token',
    scope: ['user.info.basic', 'video.list'],
  },
  linkedin: {
    enabled: false,
    clientId: '',
    clientSecret: '',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
  },
};

// Function to retrieve only enabled configurations
export const getOAuthConfig = (platform: string): OAuthConfig | null => {
  const config = oauthConfigs[platform];
  return config && config.enabled ? config : null;
};

// Function to get a list of enabled platforms
export const getEnabledPlatforms = (): string[] => {
  return Object.keys(oauthConfigs).filter((platform) => oauthConfigs[platform].enabled);
};

// Function to construct an authorization URL for a platform
export const buildAuthUrl = (platform: string, redirectUri: string, state: string): string | null => {
  const config = getOAuthConfig(platform);
  if (!config) return null;

  return `${config.authUrl}?client_id=${encodeURIComponent(config.clientId)}` +
         `&redirect_uri=${encodeURIComponent(redirectUri)}` +
         `&response_type=code` +
         `&scope=${config.scope.join(' ')}` + // Removed encodeURIComponent here
         `&state=${encodeURIComponent(state)}`;
};
