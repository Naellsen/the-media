import { fetchAniList, fetchComicVine, fetchTMDB_API } from "@/utils/api";
import { TOP_MEDIA_QUERY } from "@/query/query";
import { formatAniListItem, formatTMDBItem, formatComicVineList} from "@/utils/formaters";
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

    const raw = await fetchComicVine("volumes", {
    sort: "date_last_updated:desc",
    limit: 10,
    field_list: "id,name,publisher,start_year,count_of_issues,image,deck",
    });

    const popular = formatComicVineList(raw, "volume");
    
    return(
        <div className="bg-primary-50">
            <section className="px-30">
                <h1 className="text-xl font-bold py-5 text-white">Popular Movies</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {popularMovies.map((movie, index) => (
                        <MediaCard key={movie.id} item={movie} index={index}/>
                    ))}
                </div>
            </section>
            <section className="px-30">
                <h1 className="text-xl font-bold py-5 text-white">Popular Tv</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {popularTV.map((tv, index) => (
                        <MediaCard key={tv.id} item={tv} index={index}/>
                    ))}
                </div>
            </section>
            <section className="px-30">
                <h1 className="text-xl font-bold py-5 text-white">Popular Anime</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {topAnime.map((anime, index) => (
                        <MediaCard key={anime.id} item={anime} index={index}/>
                    ))}
                </div>
            </section>
            <section className="px-30">
                <h1 className="text-xl font-bold py-5 text-white">Popular Manga</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {topManga.map((manga, index) => (
                        <MediaCard key={manga.id} item={manga} index={index}/>
                    ))}
                </div>
            </section>
            <section className="px-30">
                <h1 className="text-xl font-bold py-5 text-white">Popular Comics</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {popular.map((comic, index) => (
                        <MediaCard key={comic.id} item={comic} index={index} />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Page
