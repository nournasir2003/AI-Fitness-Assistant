// src/lib/exercise-media.ts
//
// For every exercise, we link out to a YouTube search for that exact
// exercise name. No images, no API keys, no hosted media of any kind —
// just a reliable search link that always works.

/** A YouTube search link for this exercise's proper form / tutorial. */
export function exerciseSearchUrl(exerciseName: string): string {
  const query = encodeURIComponent(
    `${exerciseName} exercise proper form tutorial`,
  );
  return `https://www.youtube.com/results?search_query=${query}`;
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[-_/]/g, " ")
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** True for rows that aren't a real exercise (rest days, etc.) — skip the link for these. */
export function isRestRow(exerciseName: string): boolean {
  const normalized = normalize(exerciseName);
  return (
    normalized.includes("rest") ||
    normalized.includes("recovery") ||
    normalized === "" ||
    normalized === "off"
  );
}
