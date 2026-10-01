// app/tv/[id]/page.jsx

import Image from "next/image";
import Link from "next/link";
import { fetchTMDB_API } from "@/utils/api";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const show = await fetchTMDB_API(`tv/${id}`).catch(() => null);

    const title = show?.name || "TV Show Details";
    return {
        title: `${title} | The Media`,
    };
}

const Page = async ({ params }) => {
    const { id } = await params;

    const show = await fetchTMDB_API(`tv/${id}`, {
    append_to_response: "videos,credits",
    include_video_language: "en,null", // Ensures English or unassigned trailers are returned
    }).catch(() => null);

    if (!show || show.status_code === 34) {
        return (
            <div className="container mx-auto p-8 text-center text-red-500">
                <h1 className="text-2xl font-bold">TV Show Not Found</h1>
                <p className="text-gray-400 mt-2">Could not find TMDB entry with ID {id}.</p>
            </div>
        );
    }
    
    const youtubeTrailer =
    show.videos?.results?.find(
        (vid) => vid.site === "YouTube" && vid.type === "Trailer"
    ) ||
    show.videos?.results?.find(
        (vid) => vid.site === "YouTube" && vid.type === "Teaser"
    ) ||
    show.videos?.results?.find(
        (vid) => vid.site === "YouTube" // Fallback to any YouTube video available
    );

    const title = show.name || "Untitled";
    const releaseYear = show.first_air_date ? show.first_air_date.split("-")[0] : null;
    const seasonsCount = show.number_of_seasons || 0;
    const episodesCount = show.number_of_episodes || 0;

    const posterUrl = show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : "/placeholder.png";
    const backdropUrl = show.backdrop_path
        ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
        : null;



    const cast = show.credits?.cast?.slice(0, 6) || [];

    return (
        <div className="min-h-screen bg-[#0d0f12] text-white">
            {backdropUrl && (
                <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-900">
                    <Image
                        src={backdropUrl}
                        alt={`${title} backdrop`}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f12] via-[#0d0f12]/40 to-transparent" />
                </div>
            )}

            <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6 -mt-20 relative z-10">
                {/* 1. Embedded Trailer / Teaser Card */}
                {youtubeTrailer && (
                    <div className="bg-[#161a20] border border-gray-800 rounded-xl p-5 shadow-2xl">
                        <h2 className="text-lg font-bold text-white mb-4">Trailer / Teaser</h2>
                        <div className="relative w-full aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden bg-black border border-gray-800">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${youtubeTrailer.key}`}
                                title={`${title} Trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full border-0"
                            />
                        </div>
                    </div>
                )}

                {/* 2. Main TV Show Details Card */}
                <div className="bg-[#161a20] border border-gray-800 rounded-xl p-6 shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Poster Image */}
                        <div className="relative w-full md:w-72 aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-gray-800 shadow-lg">
                            <Image
                                src={posterUrl}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Content Information */}
                        <div className="flex-1 space-y-4">
                            {/* Badge & Score */}
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded uppercase tracking-wider">
                                    TV Show
                                </span>
                                {show.vote_average > 0 && (
                                    <span className="text-yellow-400 font-bold text-sm">
                                        ★ {show.vote_average.toFixed(1)} / 10
                                    </span>
                                )}
                            </div>

                            {/* Title & Tagline */}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
                                {show.tagline && (
                                    <p className="text-sm italic text-gray-400 mt-1">&quot;{show.tagline}&quot;</p>
                                )}
                            </div>

                            {/* Seasons, Episodes, and Release Year Stats */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-300">
                                {releaseYear && <span>First Aired: <strong className="text-white">{releaseYear}</strong></span>}
                                {seasonsCount > 0 && <span>Seasons: <strong className="text-white">{seasonsCount}</strong></span>}
                                {episodesCount > 0 && <span>Episodes: <strong className="text-white">{episodesCount}</strong></span>}
                                {show.status && <span>Status: <strong className="text-white">{show.status}</strong></span>}
                            </div>

                            {/* Clickable Genres */}
                            {show.genres?.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {show.genres.map((genre) => (
                                        <Link
                                            key={genre.id}
                                            href={`/genre/${encodeURIComponent(genre.name.toLowerCase())}`}
                                            className="px-3 py-1 bg-[#222831] hover:bg-green-600 text-gray-300 hover:text-white text-xs font-medium rounded transition-colors duration-200"
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Overview / Synopsis */}
                            <div className="pt-2">
                                <h3 className="text-sm font-semibold text-white mb-1">Overview</h3>
                                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                                    {show.overview || "No overview available."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Top Cast Section */}
                {cast.length > 0 && (
                    <div className="bg-[#161a20] border border-gray-800 rounded-xl p-6 shadow-2xl">
                        <h2 className="text-lg font-bold text-white mb-4">Top Cast</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {cast.map((actor) => (
                                <div
                                    key={actor.id}
                                    className="bg-[#0f1217] rounded-lg overflow-hidden border border-gray-800/80 p-2 text-center"
                                >
                                    <div className="relative w-full aspect-square bg-gray-900 rounded-md overflow-hidden mb-2">
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
                                    <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;