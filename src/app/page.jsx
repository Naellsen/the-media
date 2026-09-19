import { fetchAniList, fetchTMDB_API } from "@/utils/api";
import { TOP_MEDIA_QUERY } from "@/query/query";
import { formatAniListAnime, formatAniListManga, formatMovieListTmdb, formatTvListTmdb } from "@/utils/formaters";
import MediaCard from "@/components";


const Page = async () => {
    const popularData = await fetchAniList(TOP_MEDIA_QUERY, {
    perPage: 10,
    });
    const topAnime = (popularData?.anime?.media || []).map(formatAniListAnime);
    const topManga = (popularData?.manga?.media || []).map(formatAniListManga);

    const movieData = await fetchTMDB_API("movie/popular");
    const popularMovies = movieData?.results ? movieData.results.slice(0,10).map(formatMovieListTmdb).filter(Boolean): [];

    const tvData = await fetchTMDB_API("tv/popular");
    const popularTV = tvData?.results ? tvData.results.slice(0,10).map(formatTvListTmdb).filter(Boolean): [];

    


    return(
        <div>
            <section>
                <h1>Popular Movies</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {popularMovies.map((movie) => (
                        <MediaCard key={movie.id} item={movie}/>
                    ))}
                </div>
            </section>
            <section>
                <h1>Popular Tv</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {popularTV.map((tv) => (
                    <MediaCard key={tv.id} item={tv}/>
                    ))}
                </div>
            </section>
            <section>
                <h1>Top Anime</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {topAnime.map((anime) => (
                        <MediaCard key={anime.id} item={anime} />
                    ))}
                </div>
            </section>
            <section>
                <h1>Top Manga</h1>
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
