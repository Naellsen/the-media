"use client"
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
        <form onSubmit={handleSearch} className="flex items-center justify-between">
            <input
                placeholder="search media..."
                ref={searchRef}
                className="border-accent border rounded-md bg-primary outline-transparent"
            />
            <button type="submit" className="cursor-pointer text-sm p-1 m-2 hover:bg-secondary-50 transition-all hover:text-accent rounded-md">Search</button>
        </form>
    )
}

export default InputSearch