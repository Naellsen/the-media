import { fetchAniList, fetchTMDB_API } from "@/utils/api";
import { TOP_MEDIA_QUERY } from "@/query/query";
import { formatAniListItem, formatTMDBItem } from "@/utils/formaters";
import MediaCard from "@/components/MediaCard";

const Page = async () => {
    const popularData = await fetchAniList(TOP_MEDIA_QUERY, {
    perPage: 10,
    sort: ["TRENDING_DESC"]    
    });
    const topAnime = (popularData?.anime?.media || []).map(formatAniListItem);
    const topManga = (popularData?.manga?.media || []).map(formatAniListItem);

    const movieData = await fetchTMDB_API("movie/popular");
    const popularMovies = movieData?.results ? movieData.results.slice(0,10).map(formatTMDBItem).filter(Boolean): [];

    const tvData = await fetchTMDB_API("tv/popular");
    const popularTV = tvData?.results ? tvData.results.slice(0,10).map(formatTMDBItem).filter(Boolean): [];

    return(
        <div className="bg-primary-50">
            <section>
                <h1 className="text-xl font-bold py-5 text-white">Popular Movies</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {popularMovies.map((movie) => (
                        <MediaCard key={movie.id} item={movie}/>
                    ))}
                </div>
            </section>
            <section>
                <h1 className="text-xl font-bold py-5 text-white">Popular Tv</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {popularTV.map((tv) => (
                        <MediaCard key={tv.id} item={tv}/>
                    ))}
                </div>
            </section>
            <section>
                <h1 className="text-xl font-bold py-5 text-white">Popular Anime</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {topAnime.map((anime) => (
                        <MediaCard key={anime.id} item={anime} />
                    ))}
                </div>
            </section>
            <section>
                <h1 className="text-xl font-bold py-5 text-white">Popular Manga</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {topManga.map((manga) => (
                        <MediaCard key={manga.id} item={manga}/>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Page
