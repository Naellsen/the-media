import { authUserSession } from "@/app/libs/auth-lib"
import Image from "next/image"

const Page = async() => {
    const user = await authUserSession()

    return(
        <div>
            <h3 className="text-accent">Hello, {user.name}</h3>
            <Image 
            src={user.image}
            alt="..."
            width={200}
            height={200}
            />
        </div>
    )
}

export default Page