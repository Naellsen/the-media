import { fetchTMDB_API } from "@/utils/api";
import Image from "next/image";

const Page = async ({ params }) => {
    const { id } = await params;
    // Fetch person details along with movie credits
    const actor = await fetchTMDB_API(`person/${id}`);
    const credit = await fetchTMDB_API(`/person/${id}/combined_credits`)
    const cast = credit?.cast || [];


    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="flex flex-row gap-8">
                {/* Left Column: Profile info */}
                <div className="w-2/5">
                    <div className="relative w-32 aspect-square rounded-full overflow-hidden mb-4">
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
                    <h1 className="text-2xl font-bold">{actor.name}</h1>
                </div>

               
                <div className="w-3/5">
                    <h2 className="text-xl font-semibold mb-4">Known For</h2>
                    {cast.length > 0 ? (
                        <div className="grid grid-cols-3 overflow-hidden">
                            {cast.map((item) => (
                                <div key={item.id} className="text-neutral-300 grid-cols-3">
                                    <div className="relative w-40 h-40">
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                            alt={item.title || item.name || "Movie poster"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-medium">
                                        {item.title || item.name}
                                    </span>
                                    {item.character && (
                                        <span className="text-neutral-500 text-sm block">
                                            as {item.character}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-neutral-400">No credits found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;