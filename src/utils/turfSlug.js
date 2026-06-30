/**
 * Converts a turf name + game into a clean URL slug.
 * Example: "Champions Turf", "Football" → "champions-turf-football"
 */
export const toTurfSlug = (turfName = "", game = "") => {
  const namePart = turfName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const gamePart = game
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return gamePart ? `${namePart}-${gamePart}` : namePart;
};

/**
 * Extracts clean game names from the turf.games field
 * (handles double-encoded JSON, arrays, strings).
 */
export const extractGamesFromTurf = (games) => {
  if (!games) return [];
  const extract = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.flatMap(extract);
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed.startsWith("[")) {
        try { return extract(JSON.parse(trimmed)); } catch {}
      }
      return trimmed
        .replace(/[\[\]"'`]/g, "")
        .split(/[\/,&;]+/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
    }
    return [];
  };
  return extract(games);
};

/**
 * Builds the booking URL slug for a turf object.
 * Uses the first game if available.
 */
export const buildTurfBookUrl = (turf) => {
  const games = extractGamesFromTurf(turf?.games);
  const firstGame = games[0] || "";
  const slug = toTurfSlug(turf?.name || "", firstGame);
  return `/book/${slug}--${turf?.id}`;
};
