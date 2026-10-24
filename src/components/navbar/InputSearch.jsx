"use client"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useRef } from "react"

const InputSearch = () => {
    const searchRef = useRef()
    const router = useRouter()

    const handleSearch = (event) => {
        event.preventDefault()
        const keyword = searchRef.current?.value?.trim()

        if (!keyword) return

        router.push(`/search/${encodeURIComponent(keyword)}`)
    }

    return (
        <form onSubmit={handleSearch} className="flex items-center">
            <input
                ref={searchRef}
                className="w-50 bg-gray-600 hover:bg-white text-black rounded-xl outline-0 flex-1 caret-transparent hover:caret-black"
            />
            <button type="submit" className="relative flex cursor-pointer right-6">
                <MagnifyingGlassIcon className="h-4 w-4 hover:white"/>
            </button>
        </form>
    )
}

export default InputSearch