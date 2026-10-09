import { fetchAniList } from "@/utils/api";
import { ANILIST_DETAIL_QUERY } from "@/query/query";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params }) => {
    const { id } = await params;

    const response = await fetchAniList(ANILIST_DETAIL_QUERY, { id: Number(id) }).catch(() => null);
    const media = response?.Media || response?.data?.Media;

    if (!media) {
        return (
            <div className="container mx-auto p-8 text-center text-red-500">
                <h1 className="text-2xl font-bold">Manga Not Found</h1>
                <p className="text-gray-400 mt-2">Could not find AniList entry with ID {id}.</p>
            </div>
        );
    }

    const title = media.title?.english || media.title?.romaji || media.title?.native || "Untitled";
    const nativeTitle = media.title?.native;
    const imageUrl = media.coverImage?.extraLarge || media.coverImage?.large || "/placeholder.png";
    const authorName = media.staff?.edges?.[0]?.node?.name?.full || media.staff?.nodes?.[0]?.name?.full;
    const characters = media?.characters?.edges || [];
    const staffList = media?.staff?.edges || [];

    return (
        <div className="container mx-auto p-6 space-y-8 bg-black">
            
            {media.trailer && media.trailer.site === "youtube" && (
                <div className="pt-6 border-t border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4">Trailer / Teaser</h2>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${media.trailer.id}`}
                            title={`${title} Trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full border-0"
                        />
                    </div>
                </div>
            )}

            {media.bannerImage && (
                <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-900">
                    <Image
                        src={media.bannerImage}
                        alt={`${title} banner`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0d0f12] via-[#0d0f12]/40 to-transparent" />
                </div>
            )}

            

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative w-full md:w-80 aspect-2/3 bg-gray-800 rounded-lg overflow-hidden shrink-0 border border-gray-800">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded uppercase tracking-wider">
                            Manga
                        </span>
                        {media.averageScore && (
                            <span className="text-yellow-400 font-bold text-sm">
                                ★ {(media.averageScore / 10).toFixed(1)} / 10
                            </span>
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
                        {nativeTitle && nativeTitle !== title && (
                            <p className="text-sm text-gray-400 mt-1">{nativeTitle}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300 border-y border-gray-800 py-3">
                        {media.chapters && (
                            <div>
                                <span className="text-gray-500 block text-xs">Chapters</span>
                                <span>{media.chapters} chs {media.volumes ? `(${media.volumes} vols)` : ''}</span>
                            </div>
                        )}
                        {authorName && (
                            <div>
                                <span className="text-gray-500 block text-xs">Author</span>
                                <span>{authorName}</span>
                            </div>
                        )}
                        {media.status && (
                            <div>
                                <span className="text-gray-500 block text-xs">Status</span>
                                <span className="capitalize">{media.status.toLowerCase().replace(/_/g, ' ')}</span>
                            </div>
                        )}
                        {media.startDate?.year && (
                            <div>
                                <span className="text-gray-500 block text-xs">Released</span>
                                <span>{media.startDate.year}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {media.genres?.map((genre) => (
                            <Link
                                key={genre}
                                href={`/genre/${encodeURIComponent(genre.toLowerCase())}`}
                                className="px-3 py-1 bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white text-xs font-medium rounded-md transition-colors duration-200"
                            >
                                {genre}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-2">
                        <h2 className="text-lg font-semibold text-white mb-2">Synopsis</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                            {media.description
                                ? media.description.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '')
                                : "No description available."}
                        </p>
                    </div>

                    {characters.length > 0 && (
                        <div className="pt-4 border-t border-gray-800">
                            <h2 className="text-lg font-semibold text-white mb-4">Characters</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {characters.map(({ node: character, role }) => (
                                    <div 
                                        key={character.id} 
                                        className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg"
                                    >
                                        <Image 
                                            src={character.image?.medium || '/placeholder.png'} 
                                            alt={character.name?.full || 'Character'} 
                                            width={44}
                                            height={44}
                                            className="w-11 h-11 object-cover rounded-md shrink-0 bg-gray-800"
                                        />
                                        <div>
                                            <h4 className="text-sm font-semibold text-white line-clamp-1">
                                                {character.name?.full || 'Unknown'}
                                            </h4>
                                            <span className="text-xs text-purple-400 capitalize">
                                                {role ? role.toLowerCase() : 'Supporting'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {staffList.length > 0 && (
                        <div className="pt-4 border-t border-gray-800">
                            <h2 className="text-lg font-semibold text-white mb-4">Staff</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {staffList.map(({ node: staff, role }) => (
                                    <div 
                                        key={staff.id} 
                                        className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg"
                                    >
                                        <Image 
                                            src={staff.image?.medium || '/placeholder.png'} 
                                            alt={staff.name?.full || 'Character'} 
                                            width={44}
                                            height={44}
                                            className="w-11 h-11 object-cover rounded-md shrink-0 bg-gray-800"
                                        />
                                        <div>
                                            <h4 className="text-sm font-semibold text-white line-clamp-1">
                                                {staff.name?.full || 'Unknown'}
                                            </h4>
                                            <span className="text-xs text-purple-400 capitalize">
                                                {role ? role.toLowerCase() : 'Supporting'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;