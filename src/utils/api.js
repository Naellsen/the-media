export async function fetchAniList(query, variables = {}) {
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store", // Force Next.js to bypass the cache and grab fresh data
    });

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("AniList Fetch Error:", error);
    return null;
  }
}
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export async function fetchTMDB_API(endpoint, query = "") {
    const queryString = query ? `&query=${encodeURIComponent(query)}` : "";
    const url = `${TMDB_BASE_URL}/${endpoint}?api_key=${API_KEY}${queryString}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch TMDB data:", error);
        return null;
    }
}