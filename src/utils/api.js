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

const COMIC_BASE_URL = "https://comicvine.gamespot.com/api";

export async function fetchComicVine(resource, params = {}) {
  try {
    const query = new URLSearchParams({
      api_key: process.env.COMICVINE_API_KEY,
      format: "json",
      ...params,
    });

    const res = await fetch(`${COMIC_BASE_URL}/${resource}/?${query}`, {
      headers: {
        "User-Agent": "MyComicApp/1.0",
        Accept: "application/json",
      },
      cache: "no-store", // Next.js: always fetch fresh data
    });

    const json = await res.json();

    if (json?.status_code !== 1) {
      console.error("Comic Vine API Error:", json?.error);
      return null;
    }

    return json.results || null;
  } catch (error) {
    console.error("Comic Vine Fetch Error:", error);
    return null;
  }
}
