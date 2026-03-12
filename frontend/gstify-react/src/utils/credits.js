// Guest Demo Credit System
// Manages the 5 free uploads for unauthenticated users
//
// Credits use sessionStorage so they reset automatically when:
//   - The browser tab is closed
//   - A new browser session starts (fresh open after server restart)
// Auth (userName) still uses localStorage so logged-in users stay logged in.

const CREDITS_KEY = 'guestCredits';
const MAX_CREDITS = 5;

/**
 * Returns true if the user is logged in (has a userName set in localStorage)
 */
export const isLoggedIn = () => {
    return !!localStorage.getItem('userName');
};

/**
 * Returns the current guest credit count.
 * Initializes to MAX_CREDITS if not yet set in sessionStorage.
 */
export const getGuestCredits = () => {
    const stored = sessionStorage.getItem(CREDITS_KEY);
    if (stored === null) {
        sessionStorage.setItem(CREDITS_KEY, String(MAX_CREDITS));
        return MAX_CREDITS;
    }
    return parseInt(stored, 10);
};

/**
 * Attempts to consume one guest credit.
 * Returns true if credit was consumed, false if no credits remain.
 */
export const useGuestCredit = () => {
    const current = getGuestCredits();
    if (current <= 0) return false;
    sessionStorage.setItem(CREDITS_KEY, String(current - 1));
    return true;
};

/**
 * Resets / removes guest credits (called after login or signup).
 */
export const resetGuestCredits = () => {
    sessionStorage.removeItem(CREDITS_KEY);
};

export const MAX_GUEST_CREDITS = MAX_CREDITS;
