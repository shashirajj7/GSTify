/**
 * Shared API utility for the GSTify frontend.
 * All backend URL resolution is centralised here so there is a single
 * source of truth — update VITE_API_URL in .env and it propagates
 * everywhere.
 */

/**
 * Returns the base backend URL.
 * Priority:
 *   1. VITE_API_URL env variable (set in .env / vercel.json for prod)
 *   2. http://127.0.0.1:5000 for local development
 */
export const getBaseUrl = () => {
    // Local dev defaults to localhost, production defaults to live Render URL
    if (import.meta.env.DEV) {
        return import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
    }
    return import.meta.env.VITE_API_URL || "https://gstify.onrender.com";
};

/**
 * Ping the backend health endpoint.
 * Returns true if the server responded OK.
 */
export const pingBackend = async () => {
    try {
        const res = await fetch(`${getBaseUrl()}/api/health`, {
            method: "GET",
            signal: AbortSignal.timeout(60000), // Wait up to 60s for Render cold start
        });
        return res.ok;
    } catch {
        return false;
    }
};
