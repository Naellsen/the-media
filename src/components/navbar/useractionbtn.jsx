import Link from "next/link"
import { authUserSession } from "@/app/libs/auth-lib"

const UserActionButton = async() => {
    const user = await authUserSession()    
    const actionLabel = user ? "Sign Out" : "Sign In"
    const actionUrl = user ? "/api/auth/signout" : "api/auth/signin"
    return(
        <div>
            <Link href={actionUrl} className="">{actionLabel}</Link>
        </div>
    )
}
export default UserActionButton