/**
 * Universal logout utility to clear all authentication data and notify the application.
 * This ensures that logout is consistent across users, vendors, and admins.
 */
export const logoutUser = () => {
    // Clear all known auth-related keys
    const keysToRemove = [
        "access",
        "refresh",
        "token",
        "user",
        "isAuthenticated",
        "hasSeenLoginPopup",
        "isVendor", // added just in case
        "isAdmin",  // added just in case
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Dispatch a custom event so reactive components (like Navbar) can update immediately
    window.dispatchEvent(new Event("authChange"));

    // Optional: You could also redirect here, but we'll leave that to the components
    // for more flexibility (e.g., redirecting to different login pages).
};
