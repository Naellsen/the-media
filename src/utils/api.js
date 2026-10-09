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

// src/utils/api.js
const COMICVINE_BASE_URL = "https://gamespot.com";
// NEVER expose your real key in production frontend environments!
const COMIC_API_KEY = process.env.COMICVINE_API_KEY; 
const PROXY_URL = "https://corsproxy.io"; // Crucial: Needs /?url=

export async function fetchComicVine_API(endpoint, queryParams = "") {
    // Fixed: Removed the accidental backslash before the dynamic queryParams expression
    const params = `api_key=${COMIC_API_KEY}&format=json${queryParams ? `&\${queryParams}` : ""}`;
    const targetUrl = `${COMICVINE_BASE_URL}/${endpoint}/?${params}`;
    
    const finalUrl = `${PROXY_URL}${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        return data.results || data;
    } catch (error) {
        console.error("Comic Vine Error:", error);
        return null;
    }
}
