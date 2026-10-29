import { fetchAniList, fetchComicVine, fetchTMDB_API } from "@/utils/api";
import { TOP_MEDIA_QUERY } from "@/query/query";
import { formatAniListItem, formatTMDBItem, formatComicVineList } from "@/utils/formaters";
import MediaCard from "@/components/MediaCard";

const Page = async () => {
    const popularData = await fetchAniList(TOP_MEDIA_QUERY, {
        perPage: 1,
        sort: ["TRENDING_DESC"]    
    });
    const topAnime = (popularData?.anime?.media || []).map(formatAniListItem);
    const topManga = (popularData?.manga?.media || []).map(formatAniListItem);

    const movieData = await fetchTMDB_API("movie/popular", "limit=1");
    const popularMovies = movieData?.results ? movieData.results.slice(0, 1).map(formatTMDBItem).filter(Boolean) : [];

    const tvData = await fetchTMDB_API("tv/popular");
    const popularTV = tvData?.results ? tvData.results.slice(0, 1).map(formatTMDBItem).filter(Boolean) : [];

    const raw = await fetchComicVine("volumes", {
        sort: "date_last_updated:desc",
        limit: 1,
        field_list: "id,name,publisher,start_year,count_of_issues,image,deck",
    });
    const popularComics = formatComicVineList(raw, "volume");



    return (
        <main className="px-20">
            <section>
                <h1 className="text-white font-bold text-2xl my-4">Popular On The Media</h1>  
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {popularMovies.map((movie) => (
                        <MediaCard key={movie.id} item={movie} />
                    ))}
                    {popularTV.map((tv) => (
                        <MediaCard key={tv.id} item={tv} />
                    ))}
                    {topAnime.map((anime) => (
                        <MediaCard key={anime.id} item={anime} />
                    ))}
                    {topManga.map((manga) => (
                        <MediaCard key={manga.id} item={manga} />
                    ))}
                    {popularComics.map((comics) => (
                        <MediaCard key={comics.id} item={comics} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Page;