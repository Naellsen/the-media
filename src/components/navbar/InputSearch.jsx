"use client"
import { useRouter } from "next/navigation"
import { useRef } from "react"

const InputSearch = () => {
    const searchRef = useRef()
    const router = useRouter()

    const handleSearch = (event) => {
        event.preventDefault()
        const keyword = searchRef.current?.value?.trim()

        // Guard against empty searches
        if (!keyword) return

        router.push(`/search/${encodeURIComponent(keyword)}`)
    }

    return (
        <form onSubmit={handleSearch}>
            <input
                placeholder="search media..."
                ref={searchRef}
            />
            <button type="submit">Search</button>
        </form>
    )
}

export default InputSearch