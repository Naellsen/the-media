const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Cover</text></svg>";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// Utility to clean HTML tags returned by AniList
const cleanDescription = (text) => {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, "").trim();
};

export const formatAniListManga = (item) => {
    if (!item) return null;
    const cover = item.coverImage?.extraLarge || item.coverImage?.large;

    return {
        id: `manga-${item.id}`,
        title: item.title?.english || item.title?.romaji || "Untitled",
        image: cover && cover.trim() !== "" ? cover : PLACEHOLDER_IMAGE,
        score: item.meanScore ? (item.meanScore / 10).toFixed(1) : null,
        subtitle: `Manga • ${item.chapters ? `${item.chapters} Ch.` : "Publishing"}`,
        description: cleanDescription(item.description),
    };
};

export const formatAniListAnime = (item) => {
    if (!item) return null;
    const cover = item.coverImage?.extraLarge || item.coverImage?.large;

    return {
        id: `anime-${item.id}`,
        title: item.title?.english || item.title?.romaji || "Untitled",
        image: cover && cover.trim() !== "" ? cover : PLACEHOLDER_IMAGE,
        score: item.meanScore ? (item.meanScore / 10).toFixed(1) : null,
        subtitle: `Anime • ${item.episodes ? `${item.episodes} Ep.` : "Airing"}`,
        description: cleanDescription(item.description),
    };
};

export const formatMovieListTmdb = (item) => {
    if (!item) return null;

    const cover = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null;
    const year = item.release_date ? item.release_date.split("-")[0] : "Movie";

    return {
        id: `movie-${item.id}`,
        title: item.title || item.original_title || "Untitled",
        image: cover && cover.trim() !== "" ? cover : PLACEHOLDER_IMAGE,
        score: item.vote_average ? item.vote_average.toFixed(1) : null,
        subtitle: `Movie • ${year}`,
        description: item.overview || "",
    };
};

export const formatTvListTmdb = (item) => {
    if (!item) return null;

    const cover = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null;
    const year = item.first_air_date ? item.first_air_date.split("-")[0] : "Tv";

    return {
        id: `tv-${item.id}`,
        title: item.name || item.original_name || "Untitled",
        image: cover && cover.trim() !== "" ? cover : PLACEHOLDER_IMAGE,
        score: item.vote_average ? item.vote_average.toFixed(1) : null,
        subtitle: `TV Series • ${year}`,
        description: item.overview || "",
    };
};