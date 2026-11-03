import Image from "next/image";
import Link from "next/link";
import { fetchTMDB_API } from "@/utils/api";
import VideoPlayer from "@/utils/VideoPlayer";
import { MoreHorizontal, MoreVertical, Star, StarIcon } from "lucide-react";
import { StarHalfIcon } from "@phosphor-icons/react";

const Page = async ({ params }) => {
    const { id } = await params;

    const movie = await fetchTMDB_API(`movie/${id}`, {
        append_to_response: "videos,credits",
    }).catch(() => null);
    console.log(movie)

    if (!movie || movie.status_code === 34) {
        return (
            <div className="container mx-auto p-8 text-center text-red-500">
                <h1 className="text-2xl font-bold">Movie Not Found</h1>
                <p className="text-gray-400 mt-2">Could not find TMDB entry with ID {id}.</p>
            </div>
        );
    }

    const title = movie.title || "Untitled";
    const vote = movie.vote_average.toFixed(1);
    const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : null;
    const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
    const runtimeMins = movie.runtime ? movie.runtime % 60 : 0;
 

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/placeholder.png";
    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    const formatCurrency = (amount) => {
        amount > 0 ? `$${amount.toLocaleString()}` : null;
    }

    const videoData = await fetchTMDB_API(`movie/${id}/videos`)
    const trailer = videoData?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
    ) || videoData?.results?.find(
    (v) => v.site === 'YouTube'
    );
    const videoKey = trailer?.key;

    const credit = await fetchTMDB_API(`movie/${id}/credits`)
    const cast = credit?.cast?.slice(0 , 10) || [];

    const rawReview = await fetchTMDB_API(`movie/${id}/reviews`)
    const review = rawReview.results.slice(0,6);
    

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white">
            {backdropUrl && (
                <div className="relative w-full">
                    <Image
                    src={backdropUrl}
                    alt={`${title} backdrop`}
                    fill
                    className="object-cover opacity-50"
                    />
                </div>
            )}

            <div className="flex flex-row w-4/5 justify-between font-bold">
                <div className="flex flex-col">
                    <h1 className="text-2xl">{title}</h1>
                    <div className="flex flex-row gap-2 text-xs text-gray-500">
                        <p>{releaseYear}</p>
                        <p>{runtimeHours}.{runtimeMins}h</p>
                    </div>
                </div>
                <div className="relative flex flex-row font-bold gap-4">
                        <div className="gap-2">
                            <Star size={32} color="#d8f500" weight="fill"/>
                            <h1 className="text-2xl">{vote}/10</h1>
                        </div>
                        <div>
                            <button><Star size={20} color=""/></button>
                        </div>
                </div>
                
            </div>

            <div className="relative flex w-4/5 items-center justify-center mt-4 gap-4">
                <div className="relative w-60 aspect-2/3 overflow-hidden shrink-0 shadow-lg">
                    <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    className="relative object-cover left-10"/>
                </div>
                {videoKey ? (
                    <div className="relative w-full h-90 aspect-video overflow-hidden bg-accent">
                        <VideoPlayer
                            youtubeId={videoKey}
                        />
                    </div>
                ) : (
                    <p className="text-gray-400 items-center sp">No trailer available for this Tv Series.</p>
                )}
            </div>
            
            <div className="flex gap-4 w-4/5 mt-4">
                {movie.genres.map(genre => (
                    <Link 
                    key={genre.id} 
                    href={`/genre/${genre.name.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="border border-white rounded-4xl p-1.5"
                    >
                    {genre.name}
                    </Link>
                ))}
            </div>

            <div className="w-4/5">
                <p className="mt-4">{movie.overview}</p>
            </div>

            <div className=" flex w-4/5 mt-4">
                <div className="w-3/5">
                    <h1 className="text-2xl font-bold">Top Cast</h1>
                    <div className="grid grid-cols-2">
                        {cast.map ((actor) => (
                            <div key={actor.id} className="rounded-lg overflow-clip mt-5 flex flex-row items-center">
                                <div className="relative w-20 aspect-square rounded-full overflow-hidden">
                                    <Link key={actor.id} href={`/actor/${actor.id}`}>
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
                                    </Link>
                                </div>
                                <div className="flex flex-col w-fit p-2 font-bold">
                                    <p className="text-md">{actor.name}</p>
                                    <p className="text-xs">{actor.character}</p>
                                </div>
                            </div>
                        ))}
                        <button className="p-4 w-full font-bold flex flex-row justify-center cursor-">
                            <p>Show other actor details</p>
                            <MoreVertical size={20}/>
                        </button>
                    </div>
                </div>
                <div className="w-2/5">
                    <h1>Ranks</h1>
                </div>
            </div>
            
        </div>
    )
}

export default Page;