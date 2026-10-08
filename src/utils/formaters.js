const PLACEHOLDER_IMAGE = "/placeholder.png";

const cleanDescription = (text) => (text ? text.replace(/<[^>]*>?/gm, "") : "");

export function formatTMDBItem(item) {
    if (!item) return null;

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

    if (mediaType === "person") return null;

    const title = item.title || item.name || "Untitled";

    const rawDate = item.release_date || item.first_air_date || "";
    const releaseYear = rawDate.split("-")[0] || null;

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
        detailUrl: `/${mediaType}/${item.id}`,
    };
}

export function formatAniListItem(item) {
    if (!item) return null;

    let rawType = item.type;
    
    if (!rawType) {
        if (item.chapters || item.volumes || item.format === "MANGA" || item.format === "NOVEL") {
            rawType = "MANGA";
        } else {
            rawType = "ANIME";
        }
    }

    const mediaType = rawType.toLowerCase(); // 'anime' or 'manga'

    const title =
        item.title?.english ||
        item.title?.romaji ||
        item.title?.native ||
        "Untitled";

    const poster =
        item.coverImage?.extraLarge ||
        item.coverImage?.large ||
        PLACEHOLDER_IMAGE;

    const releaseYear = item.startDate?.year || null;
    const mediaLabel = mediaType === "manga" ? "Manga" : "Anime";

    return {
        id: `anilist-${item.id}`,
        rawId: item.id,
        title: title,
        image: poster,
        score: item.meanScore ? (item.meanScore / 10).toFixed(1) : null,
        subtitle: `${mediaLabel}${releaseYear ? ` • ${releaseYear}` : ""}`,
        description: cleanDescription(item.description),
        type: mediaType,
        // Generates /manga/[id] for manga and /anime/[id] for anime
        detailUrl: `/${mediaType}/${item.id}`,
    };
}