import MediaCard from "@/components/MediaCard"
import { SEARCH_ANILIST_QUERY } from "@/query/query"
import { fetchAniList, fetchTMDB_API} from "@/utils/api"
import { formatAniListItem, formatTMDBItem } from "@/utils/formaters"

const Page = async ({ params }) => {
    const { keyword } = await params
    const decodedKeyword = decodeURIComponent(keyword)

    const [aniListData, tmdbData] = await Promise.all([
        fetchAniList(SEARCH_ANILIST_QUERY, { search: decodedKeyword }).catch(() => null),
        fetchTMDB_API("/search/multi", decodedKeyword).catch(() => null)
    ]);

    const rawAniList = aniListData?.Page?.media || aniListData?.data?.Page?.media || [];
    const aniListResults = rawAniList.map(formatAniListItem);

    const rawTMDB = tmdbData?.results || [];
    const tmdbResults = rawTMDB.map(formatTMDBItem);

    return (
        <div className="container mx-auto p-4 space-y-10">
            <h1 className="text-3xl font-bold text-accent">Search results for "{decodedKeyword}"</h1>

            <section>
                <h2 className="text-xl font-semibold mb-8 text-accent">Movies & TV Shows</h2>
                {tmdbResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {tmdbResults.filter(Boolean).map((item) => (
                            <MediaCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No TMDB results found.</p>
                )}
            </section>
            
            <section>
                <h2 className="text-xl font-semibold mb-8 text-accent">Anime / Manga Results</h2>
                {aniListResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {aniListResults.map((item) => (
                            <MediaCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No Anime / Manga found.</p>
                )}
            </section>
        </div>
    );
};

export default Page;