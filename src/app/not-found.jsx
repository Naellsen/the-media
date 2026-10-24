"use client"

import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useRouter } from "next/router"


const Page = () => {
    const router = useRouter()

    return (
        <div>
            <div>
                <MagnifyingGlassIcon size={10} className="textcolor"/>
                <h2 className="text-white text-2xl">NOT FOUND</h2>
                <button>Back</button>
            </div>
        </div>
    )
}

export default Page