// Guest Demo Credit System
// Manages the 5 free uploads for unauthenticated users
//
// Credits use localStorage with a 30-day expiry so they:
//   - Persist across tab refreshes
//   - Remember the guest's progress for a month
// Auth (userName) still uses localStorage so logged-in users stay logged in.

const CREDITS_KEY = 'guestCredits';
const CREDITS_EXPIRY_KEY = 'guestCreditsExpiry';
const MAX_CREDITS = 5;
const EXPIRY_DAYS = 30;

/**
 * Returns true if the user is logged in (has a userName set in localStorage)
 */
export const isLoggedIn = () => {
    // If Demo Mode is explicitly active, the user is a guest, even if userName is mocked as 'Guest User'
    if (sessionStorage.getItem('demoMode') === 'true') {
        return false;
    }
    return !!localStorage.getItem('userName');
};

/**
 * Returns the current guest credit count.
 * Initializes to MAX_CREDITS and sets a 30-day expiry if not yet set or expired.
 */
export const getGuestCredits = () => {
    const expiry = localStorage.getItem(CREDITS_EXPIRY_KEY);
    const now = new Date().getTime();
    
    // Reset credits if expired or never set
    if (!expiry || now > parseInt(expiry, 10)) {
        localStorage.setItem(CREDITS_KEY, String(MAX_CREDITS));
        localStorage.setItem(CREDITS_EXPIRY_KEY, String(now + EXPIRY_DAYS * 24 * 60 * 60 * 1000));
        // Clear old demo projects when new month starts
        if (!localStorage.getItem('userName') || localStorage.getItem('userName') === 'Guest User') {
            localStorage.removeItem('approvedInvoices');
        }
        return MAX_CREDITS;
    }

    const stored = localStorage.getItem(CREDITS_KEY);
    return stored ? parseInt(stored, 10) : MAX_CREDITS;
};

/**
 * Attempts to consume one guest credit.
 * Returns true if credit was consumed, false if no credits remain.
 */
export const useGuestCredit = () => {
    const current = getGuestCredits();
    if (current <= 0) return false;
    localStorage.setItem(CREDITS_KEY, String(current - 1));
    return true;
};

export const resetGuestCredits = () => {
    localStorage.removeItem(CREDITS_KEY);
    localStorage.removeItem(CREDITS_EXPIRY_KEY);
};

export const MAX_GUEST_CREDITS = MAX_CREDITS;
