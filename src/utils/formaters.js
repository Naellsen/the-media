const PLACEHOLDER_IMAGE = "/placeholder.jpg"; // Replace with your placeholder path

// Helper to sanitize HTML tags or long text from summaries
const cleanDescription = (text) => {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, "").slice(0, 150) + "...";
};

// --- ANILIST FORMATTER ---
export const formatAniListItem = (item) => {
    if (!item) return null;

    const type = item.type?.toLowerCase() || (item.episodes !== undefined ? 'anime' : 'manga');
    const isAnime = type === 'anime';
    const cover = item.coverImage?.extraLarge || item.coverImage?.large;
    const statusText = isAnime
        ? (item.episodes ? `${item.episodes} Ep.` : 'Airing')
        : (item.chapters ? `${item.chapters} Ch.` : 'Publishing');

    return {
        id: `anilist-${type}-${item.id}`,
        title: item.title?.english || item.title?.romaji || item.title?.native || "Untitled",
        image: cover && cover.trim() !== "" ? cover : PLACEHOLDER_IMAGE,
        score: item.meanScore ? (item.meanScore / 10).toFixed(1) : null,
        subtitle: `${isAnime ? 'Anime' : 'Manga'} • ${statusText}`,
        description: cleanDescription(item.description),
        type: type,
        url: `/${type}/${item.id}`,
        detailUrl: `/details/anilist/${item.id}`,
    };
};

// --- TMDB FORMATTER ---
export const formatTMDBItem = (item) => {
    if (!item) return null;
    const mediaType = item.media_type || "movie" || "tv";
    if (mediaType === 'person') return null; // Optionally ignore actor results


    const title = item.title || item.name || "Untitled";
    const releaseYear = (item.release_date || item.first_air_date || '').split('-')[0];
    const poster = item.poster_path || item.profile_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}${item.profile_path}` 
        : PLACEHOLDER_IMAGE;

    const mediaLabel = mediaType === 'tv' ? 'TV Series' : 'Movie';
    
    return {
        id: `tmdb-${mediaType}-${item.id}`,
        title: title,
        image: poster,
        score: item.vote_average ? item.vote_average.toFixed(1) : null,
        subtitle: `${mediaLabel} ${releaseYear ? `• ${releaseYear}` : ''}`,
        description: cleanDescription(item.overview),
        type: mediaType,
        url: `/${mediaType}/${item.id}`,
        detailUrl: `/media/tmdb-${mediaType}/${item.id}`,
    };
};