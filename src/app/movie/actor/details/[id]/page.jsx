import { fetchTMDB_API } from "@/utils/api"
import Image from "next/image";

const Page = async ({params}) => {
    const {id} = await params;

    const movie = await fetchTMDB_API(`movie/${id}`);
    console.log(movie)

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/placeholder.png";

    const credit = await fetchTMDB_API(`movie/${id}/credits`);
    const cast = credit?.cast || [];
    

    return (
        <div className="min-h-screen text-white">
            <div className="w-4/5 items-center justify-center">
                <div className="relative w-50 aspect-2/3 overflow-hidden shrink-0 shadow-lg rounded-2xl">
                    <Image 
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"/>
                </div>
                <h1 className="text-2xl font-bold   ">
                    {movie.title}
                </h1>
            </div>
            <div>
                <h1>Cast</h1>
                {cast.map ((actor) => (
                            <div key={actor.id} className="rounded-lg overflow-clip mt-5 flex flex-row items-center">
                                <div className="relative w-20 aspect-square rounded-full overflow-hidden">
                                        <Image 
                                            src={
                                                actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                : "/placeholder.png"
                                            }
                                            alt={actor.name}
                                            fill
                                            className="object-cover"
                                        />
                                </div>
                                <div className="flex flex-col w-fit p-2 font-bold">
                                    <p className="text-md">{actor.name}</p>
                                    <p className="text-xs">{actor.character}</p>
                                </div>
                            </div>
                ))}
            </div>
        </div>
    )
}

export default Page