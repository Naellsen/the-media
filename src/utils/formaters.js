const PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'><rect width='100%' height='100%' fill='%231f2937'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='24'>No Cover</text></svg>";


export const formatAniListManga = (item) => {
    if (!item) return null;
    const cover = item.coverImage?.extraLarge || item.coverImage?.large;

    return {
        id:`manga-${item.id}`,
        title: item.title?.english || item.title?.romaji || "Untitled",
        image: cover && cover.trim() !== "" ? cover: PLACEHOLDER_IMAGE,
        score: item.meanScore ? (item.meanScore / 10).toFixed(1) : null,
        badge: item.meanScore ? `★ ${(item.meanScore / 10).toFixed(1)}` : null,
        subtitle: `Manga • ${item.chapters ? `${item.chapters} Ch.` : "Publishing"}`,
    };
};

export const formatAniListAnime = (item) => {
    if (!item) return null;
    const cover = item.coverImage?.extraLarge || item.coverImage?.large;

    return{
        id: `anime-${item.id}`,
        title: item.title?.english || item.title?.romaji || "Untitled",
        image: cover && cover.trim() !== "" ? cover:PLACEHOLDER_IMAGE,
        score: item.meanScore ? (item.meanScore / 10).toFixed(1) : null,
        badge: item.meanScore ? `★ ${(item.meanScore / 10).toFixed(1)}` : null,
        subtitle:  `Anime • ${item.episode ? `${item.episode} Ep.` : "Aired"}`,
    };
};

export const formatMovieListTmdb = (item) => {
    if(!item) return null;

    return{
        id: `movie-${item.id}`,
        title: item.original_title,
        image: item.poster_path,
        score: item.vote_average,
        subtitle: item.overview,
    };
};