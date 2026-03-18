// Utility for managing user-specific LocalStorage data

/**
 * Helper to get the current storage suffix based on the logged-in user.
 * If no user is logged in, it falls back to 'guest'.
 */
const getStorageSuffix = () => {
    const userId = localStorage.getItem('userId');
    return userId ? `_${userId}` : '_guest';
};

// --- Invoices ---

export const getUserInvoices = () => {
    const suffix = getStorageSuffix();
    const stored = localStorage.getItem(`approvedInvoices${suffix}`);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse user invoices", e);
            return [];
        }
    }
    
    // Fallback: If no user-specific invoices exist, but a legacy global one does
    // (this helps the first time a user logs in after this update)
    if (suffix !== '_guest') {
        const legacyStored = localStorage.getItem('approvedInvoices');
        if (legacyStored) {
            try {
                const parsed = JSON.parse(legacyStored);
                // Migrate them over
                saveUserInvoices(parsed);
                // Clear legacy so we don't keep migrating
                localStorage.removeItem('approvedInvoices');
                return parsed;
            } catch (e) {
                return [];
            }
        }
    }
    
    return [];
};

export const saveUserInvoices = (invoices) => {
    const suffix = getStorageSuffix();
    localStorage.setItem(`approvedInvoices${suffix}`, JSON.stringify(invoices));
};

// --- Settings/Profile Data ---

export const getUserSettings = () => {
    const suffix = getStorageSuffix();
    const stored = localStorage.getItem(`userSettings${suffix}`);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse user settings", e);
            return null;
        }
    }
    return null;
};

export const saveUserSettings = (settings) => {
    const suffix = getStorageSuffix();
    // Merge with existing
    const existing = getUserSettings() || {};
    const updated = { ...existing, ...settings };
    localStorage.setItem(`userSettings${suffix}`, JSON.stringify(updated));
};
