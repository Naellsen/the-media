import MediaCard from "@/components/MediaCard"
import { SEARCH_ANILIST_QUERY } from "@/query/query"
import { fetchAniList, fetchTMDB_API, fetchComicVine} from "@/utils/api"
import { formatAniListItem, formatTMDBItem, formatComicVineList } from "@/utils/formaters"


export async function searchComics(term, resources = "volume,issue", limit=20) {
    if (!term?.trim()) return [];

  const raw = await fetchComicVine("search", {
    query: term.trim(),
    resources,
    limit,
    field_list:
      "id,name,resource_type,publisher,start_year,count_of_issues,image,deck,volume,issue_number,store_date,cover_date",
  });

  return formatComicVineList(raw);
}

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

    const results = await searchComics(decodedKeyword);
    console.log(results)

    return (
        <div className="container mx-auto p-4 space-y-10">
            <h1 className="text-3xl font-bold text-accent">Search results for "{decodedKeyword}"</h1>

            <section>
                <h2 className="text-xl font-semibold mb-8 text-accent">Movies & TV Shows</h2>
                {tmdbResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {tmdbResults.filter(Boolean).map((item, index) => (
                            <MediaCard key={item.id} item={item} index={index}/>
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
                        {aniListResults.map((item, index) => (
                            <MediaCard key={item.id} item={item} index={index}/>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No Anime / Manga found.</p>
                )}
            </section>
            <section>
                <h2 className="text-xl font-semibold mb-8 text-accent">Comics / Issue Results</h2>
                {results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.map((comic, index) => (
                        <MediaCard key={comic.id} item={comic} index={index} />
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No comics found.</p>
                )}
            </section>
        </div>
    );
};

export default Page;