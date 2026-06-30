// Central API base URL — reads from .env for local dev, falls back to production
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

export default API_BASE;
