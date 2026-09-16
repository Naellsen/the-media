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