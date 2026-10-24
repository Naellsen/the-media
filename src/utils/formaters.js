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
        detailUrl: `/${mediaType}/${item.id}`,
    };
}

const COMIC_PLACEHOLDER = PLACEHOLDER_IMAGE; // reuse your existing placeholder

function cleanComicDescription(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatComicVineItem(item, typeHint = "volume") {
  if (!item) return null;

  const resource = item.resource_type || typeHint;

  const image =
    item.image?.super_url ||
    item.image?.original_url ||
    item.image?.medium_url ||
    PLACEHOLDER_IMAGE;

  let title = item.name || "Untitled";
  let subtitle = "Comic";

  if (resource === "issue") {
    const seriesName = item.volume?.name;
    title = item.name || (seriesName ? `${seriesName} #${item.issue_number}` : "Untitled");
    const date = item.store_date || item.cover_date;
    const year = date ? date.slice(0, 4) : null;
    subtitle = `Issue${item.issue_number ? ` #${item.issue_number}` : ""}${year ? ` • ${year}` : ""}`;
  } else if (resource === "character") {
    subtitle = `Character${item.publisher?.name ? ` • ${item.publisher.name}` : ""}`;
  } else {
    const year = item.start_year || null;
    subtitle = `Comic${year ? ` • ${year}` : ""}${item.publisher?.name ? ` • ${item.publisher.name}` : ""}`;
  }

  return {
    id: `comicvine-${resource}-${item.id}`,
    rawId: item.id,
    title,
    image,
    score: null,
    subtitle,
    description: cleanComicDescription(item.deck || item.description),
    type: "comic",
    detailUrl: resource === "volume" ? `/comic/${item.id}` : `/comic/${resource}/${item.id}`,
  };
}

export function formatComicVineList(items, typeHint) {
  return (items || []).map((i) => formatComicVineItem(i, typeHint)).filter(Boolean);
}