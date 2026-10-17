import { fetchAniList, fetchComicVine, fetchTMDB_API } from "@/utils/api";
import { TOP_MEDIA_QUERY } from "@/query/query";
import { formatAniListItem, formatTMDBItem, formatComicVineList } from "@/utils/formaters";
import MediaRow from "@/components/MediaRow";

const Page = async () => {
    // 1. Fetch AniList Data
    const popularData = await fetchAniList(TOP_MEDIA_QUERY, {
        perPage: 10,
        sort: ["TRENDING_DESC"]    
    });
    const topAnime = (popularData?.anime?.media || []).map(formatAniListItem);
    const topManga = (popularData?.manga?.media || []).map(formatAniListItem);

    // 2. Fetch TMDB Data
    const movieData = await fetchTMDB_API("movie/popular");
    const popularMovies = movieData?.results ? movieData.results.slice(0, 10).map(formatTMDBItem).filter(Boolean) : [];

    const tvData = await fetchTMDB_API("tv/popular");
    const popularTV = tvData?.results ? tvData.results.slice(0, 10).map(formatTMDBItem).filter(Boolean) : [];

    // 3. Fetch ComicVine Data
    const raw = await fetchComicVine("volumes", {
        sort: "date_last_updated:desc",
        limit: 10,
        field_list: "id,name,publisher,start_year,count_of_issues,image,deck",
    });
    const popularComics = formatComicVineList(raw, "volume");

    return (
        <div className="bg-primary-50 py-5">
            <MediaRow title="Popular Movies" items={popularMovies} />
            <MediaRow title="Popular Tv" items={popularTV} />
            <MediaRow title="Popular Anime" items={topAnime} />
            <MediaRow title="Popular Manga" items={topManga} />
            <MediaRow title="Popular Comics" items={popularComics} />
        </div>
    );
};

export default Page;