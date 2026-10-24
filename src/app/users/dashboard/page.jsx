import { authUserSession } from "@/app/libs/auth-lib"
import Image from "next/image"

const Page = async() => {
    const user = await authUserSession()

    return(
        <div className="relative border-box flex m-10 items-center">
            <div className="flex items-center">
                <Image 
                src={user.image}
                alt="..."
                width={100}
                height={100}
                className="rounded-full object-cover"
                />
            </div>
            <div className="relative flex items-center ml-4 top-0">
                <h1 className="text-accent font-bold text-2xl">{user.name}</h1>
                <button className="text-gray-400 ml-4 cursor-pointer bg-gray-500 rounded-sm p-1 font-bold hover:text-accent">
                    Edit profile
                </button>
                <button className="w-6 h-6 m-4 rounded-full bg-gray-400 text-white flex items-center justify-center cursor-pointer">
                </button>
            </div>
        </div>
    )
}

export default Page