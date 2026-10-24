import { fetchTMDB_API } from "@/utils/api"

const Page = async ({params}) => {
    const {genre} = decodeURIComponent(params);
    const genreId = Genre.genres.find(g => g.name.toLowerCase() === genre.toLowerCase())?.id;
    

    return(
        <div>
          <h1>Test</h1>
        </div>
    )
}

export default Page