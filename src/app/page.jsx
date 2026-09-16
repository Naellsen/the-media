import { fetchAniList } from "@/utils/api";
import { TOP_MEDIA_QUERY } from "@/query/query";
import { formatAniListAnime } from "@/utils/formaters";
import MediaCard from "@/components";


const Page = async () => {
    const popularData = await fetchAniList(TOP_MEDIA_QUERY, {
    perPage: 10,
    sort: ["POPULARITY_DESC"]
    });
    console.log(popularData)
    const topAnime = (popularData?.anime?.media || []).map(formatAniListAnime);


    return(
        <div>
            <section>
                <h1>Top Anime</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {topAnime.map((anime) => (
                    <MediaCard key={anime.id} item={anime} />
                ))}
                </div>
            </section>
            
        </div>
    )
}

export default Page
