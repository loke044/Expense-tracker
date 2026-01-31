import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tokenClient, setTokenClient] = useState(null);
    const [gapiInitialized, setGapiInitialized] = useState(false);

    const fetchProfile = async (accessToken) => {
        try {
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.ok) {
                const profile = await res.json();
                return profile.given_name || profile.name;
            }
        } catch (e) {
            // Silently fail profile fetch
        }
        return null;
    };

    useEffect(() => {
        const initializeGoogleModules = () => {
            // 1. Load GAPI (for API calls)
            if (window.gapi) {
                window.gapi.load("client", async () => {
                    await window.gapi.client.init({
                        block_on_load: true,
                    });
                    // Load Sheets and Drive Discovery Docs
                    await Promise.all([
                        window.gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4"),
                        window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest")
                    ]);
                    setGapiInitialized(true);

                    // Restore token ONLY after GAPI is ready
                    const storedToken = localStorage.getItem("google_access_token");
                    if (storedToken) {
                        const name = localStorage.getItem("google_user_name");
                        setUser({ accessToken: storedToken, name });
                        window.gapi.client.setToken({ access_token: storedToken });

                        // Refetch profile to be sure
                        fetchProfile(storedToken).then(fetchedName => {
                            if (fetchedName) {
                                setUser(u => ({ ...u, name: fetchedName }));
                                localStorage.setItem("google_user_name", fetchedName);
                            }
                        });
                    }
                    setLoading(false);
                });
            }

            // 2. Load GIS (for Authentication)
            if (window.google) {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    callback: async (tokenResponse) => {
                        if (tokenResponse && tokenResponse.access_token) {
                            const accessToken = tokenResponse.access_token;
                            const name = await fetchProfile(accessToken);

                            setUser({
                                accessToken,
                                expiresIn: tokenResponse.expires_in,
                                timestamp: Date.now(),
                                name
                            });
                            localStorage.setItem("google_access_token", accessToken);
                            if (name) localStorage.setItem("google_user_name", name);

                            // Also set token on GAPI client immediately on login
                            if (window.gapi && window.gapi.client) {
                                window.gapi.client.setToken({ access_token: accessToken });
                            }
                        }
                    },
                });
                setTokenClient(client);
            }
        };

        // Retry loading if scripts aren't ready
        const timer = setInterval(() => {
            if (window.google && window.gapi) {
                initializeGoogleModules();
                clearInterval(timer);
            }
        }, 500);

        return () => clearInterval(timer);
    }, []);

    const login = () => {
        if (tokenClient) {
            // Prompt the user to select an account.
            // requestAccessToken({ prompt: '' }) will skip prompt if already consented
            // requestAccessToken({ prompt: '' }) will skip prompt if already consented
            tokenClient.requestAccessToken({ prompt: '' });
        }
    };

    const logout = () => {
        /* 
           NOTE: We do NOT revoke the token here, because that removes the app's permissions 
           entirely, forcing the user to re-consent on next login. 
           We just clear the local session.
        */
        // const token = user?.accessToken;
        // if (token && window.google) {
        //     window.google.accounts.oauth2.revoke(token, () => {
        //         console.log('Access token revoked');
        //     });
        // }
        setUser(null);
        localStorage.removeItem("google_access_token");
        localStorage.removeItem("google_user_name");
        window.gapi.client.setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, gapiInitialized }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
