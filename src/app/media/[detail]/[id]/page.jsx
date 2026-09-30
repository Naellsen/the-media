// app/details/tmdb/[id]/page.jsx

import Image from "next/image";
import { fetchTMDB_API } from "@/utils/api";

export default async function TMDBDetailPage({ params, searchParams }) {
    const { id } = await params;
    const { type = "movie" } = await searchParams; // defaults to 'movie' if missing

    // 1. Fetch details directly based on endpoint (e.g., 'movie/550', 'tv/1399', 'person/287')
    const data = await fetchTMDB_API(`${type}/${id}`);

    if (!data || data.status_code === 34) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Item Not Found</h1>
                <p className="text-gray-400 mt-2">
                    Could not find TMDB {type} with ID {id}.
                </p>
            </div>
        );
    }

    // 2. Extract title/name & image
    const title = data.title || data.name || "Untitled";
    const overview = data.overview || data.biography || "No description available.";
    const imagePath = data.poster_path || data.profile_path;
    const imageUrl = imagePath 
        ? `https://image.tmdb.org/t/p/w500${imagePath}` 
        : "/placeholder.png";

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Poster / Image */}
                <div className="relative w-full md:w-80 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-semibold rounded uppercase">
                        TMDB {type}
                    </span>
                    <h1 className="text-4xl font-bold">{title}</h1>
                    
                    {data.tagline && (
                        <p className="italic text-gray-400">&quot;{data.tagline}&quot;</p>
                    )}

                    {data.vote_average && (
                        <div className="flex items-center gap-2 text-yellow-400 font-bold">
                            ★ {data.vote_average.toFixed(1)} / 10
                        </div>
                    )}

                    <div className="pt-2">
                        <h2 className="text-lg font-semibold mb-2">Overview</h2>
                        <p className="text-gray-300 leading-relaxed">{overview}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}