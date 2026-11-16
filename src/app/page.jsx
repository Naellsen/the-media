import { fetchAniList, fetchComicVine, fetchTMDB_API } from "@/utils/api";
import { TOP_MEDIA_QUERY } from "@/query/query";
import { formatAniListItem, formatTMDBItem, formatComicVineList } from "@/utils/formaters";
import MediaCard from "@/components/MediaCard";
import Image from "next/image";

const Page = async () => {
    const popularData = await fetchAniList(TOP_MEDIA_QUERY, {
        perPage: 1,
        sort: ["TRENDING_DESC"]    
    });
    const topAnime = (popularData?.anime?.media || []).map(formatAniListItem);
    const topManga = (popularData?.manga?.media || []).map(formatAniListItem);

    const movieData = await fetchTMDB_API("movie/popular");
    const popularMovies = movieData?.results ? movieData.results.slice(0, 1).map(formatTMDBItem).filter(Boolean) : [];
    const recomendationMovies = movieData?.results ? movieData.results.slice(0,5).map(formatTMDBItem).filter(Boolean): [];

    const tvData = await fetchTMDB_API("tv/popular");
    const popularTv = tvData?.results ? tvData.results.slice(0, 1).map(formatTMDBItem).filter(Boolean) : [];
     const recomendationTv = tvData?.results ? tvData.results.slice(0, 5).map(formatTMDBItem).filter(Boolean) : [];

    const raw = await fetchComicVine("volumes", {
        sort: "date_last_updated:desc",
        limit: 1,
        field_list: "id,name,publisher,start_year,count_of_issues,image,deck",
    });
    const recomendation = await fetchComicVine("volumes", {
        sort: "date_last_updated:desc",
        limit: 5,
        field_list: "id,name,publisher,start_year,count_of_issues,image,deck",
    });
    const popularComics = formatComicVineList(raw, "volume");
    const recomendationComics = formatComicVineList(recomendation, "volume")

    return (
        <div className="min-h-screen flex justify-center w-full">
            <div className="w-3/5">
                <div className="flex justify-between">
                    <h1 className="text-white font-bold text-xl">Popular On The Media</h1>
                    <a className="text-gray-400" href="/popular">Test</a>                
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {popularMovies.map((movie) => (
                            <MediaCard key={movie.id} item={movie} />
                        ))}
                        {popularTv.map((tv) => (
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
                <div>
                    <h1 className="text-white">Recomendation for you</h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {recomendationMovies.map((movies) => (
                            <MediaCard key={movies.id} item={movies}/>
                        ))}
                        {recomendationTv.map((tv) => (
                            <MediaCard key={tv.id} item={tv}/>
                        ))}
                        {recomendationComics.map((comics) => (
                            <MediaCard key={comics.id} item={comics}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;