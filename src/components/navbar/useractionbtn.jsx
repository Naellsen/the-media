import Link from "next/link"
import { authUserSession } from "@/app/libs/auth-lib"
import UserDropdown from "./UserDropdown" // adjust import path as needed

const UserActionButton = async () => {
    const user = await authUserSession()

    if (!user) {
        return (
            <Link 
                href="/api/auth/signin" 
                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                Sign In
            </Link>
        )
    }

    return <UserDropdown user={user} />
}

export default UserActionButton