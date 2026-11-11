import { fetchTMDB_API } from "@/utils/api"
import Image from "next/image";
import Link from "next/link";

const Page = async ({params}) => {
    const {id} = await params;

    const movie = await fetchTMDB_API(`movie/${id}`);

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/placeholder.png";

    const credit = await fetchTMDB_API(`movie/${id}/credits`);
    const cast = credit?.cast || [];
    

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white">
            <div className="w-4/5 flex flex-row items-center mt-5 gap-5">
                <div className="relative w-50 aspect-2/3 overflow-hidden shrink-0 shadow-lg rounded-2xl">
                    <Image 
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"/>
                </div>
                <div>
                    <h1 className="text-2xl font-bold">
                        {movie.title}
                    </h1>
                </div>         
            </div>
            <div className="w-4/5">
                <h1 className="text-2xl font-bold mt-4">Cast</h1>
                <div className="grid grid-cols-3">
                    {cast.map ((actor) => (
                            <div key={actor.id} className="rounded-lg overflow-clip mt-5 flex flex-row items-center">
                                <div className="relative w-20 aspect-square rounded-full overflow-hidden">
                                    <Link href={`/actor/${actor.id}`}>
                                        <Image 
                                            src={
                                                actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                            }
                                            alt={actor.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>
                                </div>
                                <div className="flex flex-col w-fit p-2 font-bold">
                                    <Link href={`/actor/${actor.id}`}>
                                        <p className="text-md">{actor.name}</p>
                                    </Link>
                                    <Link href={`/character/`}>
                                        <p className="text-xs">{actor.character}</p>
                                    </Link>
                                </div>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page