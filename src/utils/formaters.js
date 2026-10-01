// @/utils/formaters.js

const PLACEHOLDER_IMAGE = "/placeholder.png";

const cleanDescription = (text) => (text ? text.replace(/<[^>]*>?/gm, "") : "");

export function formatTMDBItem(item) {
    if (!item) return null;

    // 1. Detect mediaType (Handles search/multi and standalone endpoints like /trending/tv)
    let mediaType = item.media_type;
    if (!mediaType) {
        if (item.first_air_date || (item.name && !item.title)) {
            mediaType = "tv";
        } else if (item.known_for_department || item.profile_path) {
            mediaType = "person";
        } else {
            mediaType = "movie";
        }
    }

    // Optionally ignore person/actor search results
    if (mediaType === "person") return null;

    // 2. Normalize Title (Movies use 'title', TV uses 'name')
    const title = item.title || item.name || "Untitled";

    // 3. Normalize Release Year
    const rawDate = item.release_date || item.first_air_date || "";
    const releaseYear = rawDate.split("-")[0] || null;

    // 4. Safely construct poster image URL (prevents appending 'undefined')
    const imagePath = item.poster_path || item.profile_path;
    const poster = imagePath
        ? `https://image.tmdb.org/t/p/w500${imagePath}`
        : PLACEHOLDER_IMAGE;

    const mediaLabel = mediaType === "tv" ? "TV Series" : "Movie";

    return {
        id: `tmdb-${item.id}`,
        rawId: item.id,
        title: title,
        image: poster,
        score: item.vote_average ? item.vote_average.toFixed(1) : null,
        subtitle: `${mediaLabel}${releaseYear ? ` • ${releaseYear}` : ""}`,
        description: cleanDescription(item.overview),
        type: mediaType,
        // Dedicated folder routes (/movie/550 or /tv/1399)
        detailUrl: `/${mediaType}/${item.id}`,
    };
}

export function formatAniListItem(item) {
    if (!item) return null;

    // 1. Detect type cleanly (Checks item.type, format, or chapter/volume presence)
    let rawType = item.type;
    
    if (!rawType) {
        if (item.chapters || item.volumes || item.format === "MANGA" || item.format === "NOVEL") {
            rawType = "MANGA";
        } else {
            rawType = "ANIME";
        }
    }

    const mediaType = rawType.toLowerCase(); // 'anime' or 'manga'

    // 2. Extract Title
    const title =
        item.title?.english ||
        item.title?.romaji ||
        item.title?.native ||
        "Untitled";

    // 3. Extract Cover Image
    const poster =
        item.coverImage?.extraLarge ||
        item.coverImage?.large ||
        PLACEHOLDER_IMAGE;

    // 4. Extract Release Year & Subtitle
    const releaseYear = item.startDate?.year || null;
    const mediaLabel = mediaType === "manga" ? "Manga" : "Anime";

    return {
        id: `anilist-${item.id}`,
        rawId: item.id,
        title: title,
        image: poster,
        score: item.averageScore ? (item.averageScore / 10).toFixed(1) : null,
        subtitle: `${mediaLabel}${releaseYear ? ` • ${releaseYear}` : ""}`,
        description: cleanDescription(item.description),
        type: mediaType,
        // Generates /manga/[id] for manga and /anime/[id] for anime
        detailUrl: `/${mediaType}/${item.id}`,
    };
}