import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../utils/supabaseClient';
import Modal from '../../../ui/Modal';
import { redirectToOAuth, exchangeToken } from './oauthService';
import "../../../../../assets/styles/substyles/SocialLinks.css";
import facebookLogo from '../../../../../assets/icons/facebook.png';
import instagramLogo from '../../../../../assets/icons/instagram.png';
import youtubeLogo from '../../../../../assets/icons/youtube.png';
import tiktokLogo from '../../../../../assets/icons/tiktok.png';
import linkedinLogo from '../../../../../assets/icons/linkedin.png';
import { getEnabledPlatforms } from './oauthConfig';

const SocialLinks: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [accountToRemove, setAccountToRemove] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showPlatformModal, setShowPlatformModal] = useState<boolean>(false);
  const enabledPlatforms = getEnabledPlatforms();

  const platformLogos: Record<string, string> = {
    facebook: facebookLogo,
    instagram: instagramLogo,
    youtube: youtubeLogo,
    tiktok: tiktokLogo,
    linkedin: linkedinLogo,
  };

  // Fetch social accounts and check user session
  useEffect(() => {
    fetchAccounts();

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const handleOAuthCallback = async () => {
      if (code && state) {
        const platform = sessionStorage.getItem("oauth_platform");
        const savedState = sessionStorage.getItem("oauth_state");

        if (state !== savedState) {
          console.error("OAuth state mismatch. Possible CSRF attack.");
          return;
        }

        try {
          console.log("Exchanging code for token...");
          const tokenResponse = await exchangeToken(platform!, code);
          console.log("Token response:", tokenResponse);

          // Fetch user info from platform API
          const fetchYouTubeUserInfo = async (accessToken: string) => {
            try {
              const response = await fetch(
                "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                }
              );
              const data = await response.json();
              return data.items[0]?.snippet?.title || "Unknown User";
            } catch (error) {
              console.error("Error fetching YouTube user info:", error);
              throw error;
            }
          };

          const { access_token } = tokenResponse;
          const username = await fetchYouTubeUserInfo(access_token);

          // Save account info in Supabase
          handleAddAccount(platform!, access_token, username);
        } catch (error) {
          console.error("Error during token exchange:", error);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user || sessionError) {
        console.error('User not authenticated or session error:', sessionError?.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setAccounts(data || []);
    } catch (error: any) {
      console.error('Error fetching accounts:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth Redirection
  const handleRedirectToOAuth = async () => {
    if (!selectedPlatform) {
      console.error('No platform selected!');
      return;
    }

    console.log(`Redirecting to OAuth for platform: ${selectedPlatform}`);
    redirectToOAuth(selectedPlatform); // Redirects to the OAuth provider
  };

  // Add Account After OAuth Flow
  const handleAddAccount = async (platform: string, accessToken: string, username: string) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user || sessionError) {
        console.error('User not authenticated or session error:', sessionError?.message);
        return;
      }

      const newAccount = {
        user_id: user.id,
        platform: platform,
        username: username,
        access_token: accessToken,
        status: true, // Set true for connected accounts
      };

      const { error } = await supabase
        .from('social_accounts')
        .insert([newAccount]);

      if (error) throw error;

      console.log('Account added successfully');
      fetchAccounts(); // Refresh account list
    } catch (error: any) {
      console.error('Error adding account:', error.message || error);
    }
  };

  // Remove Account
  const handleRemoveAccount = async () => {
    if (!accountToRemove) return;

    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountToRemove);
      if (error) throw error;

      setAccounts(accounts.filter((account) => account.id !== accountToRemove));
    } catch (error: any) {
      console.error('Error removing account:', error.message || error);
    } finally {
      setShowModal(false);
      setAccountToRemove(null);
    }
  };

  // Render Account Cards
  const renderAccountCards = () => {
    if (loading) {
      return <div className="skeleton-loader">Loading accounts...</div>;
    }

    if (accounts.length === 0) {
      return <p>No accounts linked. Click "Add New Account" to get started.</p>;
    }

    return accounts.map((account) => (
      <div key={account.id} className="account-card">
        <img
          src={platformLogos[account.platform]}
          alt={`${account.platform} logo`}
          className="platform-logo"
        />
        <h3>{account.username}</h3>
        <p>Status: {account.status ? 'Connected' : 'Disconnected'}</p>
        <button
          className="manage-btn"
          onClick={() => console.log(`Manage ${account.platform} account`)}
        >
          Manage
        </button>
        <button
          className="remove-btn"
          onClick={() => {
            setAccountToRemove(account.id);
            setShowModal(true);
          }}
        >
          Remove
        </button>
      </div>
    ));
  };

  return (
    <div className="social-links">
      <div className="header">
        <h1>Social Media Accounts</h1>
        <button
          className="bizeeed-button"
          onClick={() => setShowPlatformModal(true)}
        >
          + Add New Account
        </button>
      </div>

      {/* Account Grid */}
      <div className="account-grid">{renderAccountCards()}</div>

      {/* Platform Selection Modal */}
      {showPlatformModal && (
        <Modal
          title="Select a Platform"
          onClose={() => setShowPlatformModal(false)}
          onConfirm={() => {
            handleRedirectToOAuth(); // Redirects to OAuth
            setShowPlatformModal(false);
          }}
        >
          <div className="platform-options">
            {enabledPlatforms.map((platform) => (
              <button
                key={platform}
                className={`platform-btn ${selectedPlatform === platform ? 'selected' : ''}`}
                onClick={() => setSelectedPlatform(platform)}
              >
                <img
                  src={platformLogos[platform]}
                  alt={`${platform} logo`}
                  className="platform-logo"
                />
                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Account Removal Confirmation Modal */}
      {showModal && (
        <Modal
          title="Confirm Removal"
          onClose={() => setShowModal(false)}
          onConfirm={handleRemoveAccount}
        >
          Are you sure you want to remove this account? This action cannot be undone.
        </Modal>
      )}
    </div>
  );
};

export default SocialLinks;
