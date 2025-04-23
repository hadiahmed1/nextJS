"use client"
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth"

const NavBar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    console.log(user);
    return (
        <div>
            <nav className="p-5 shadow-md flex justify-between">
                <a href="#" className="text-2xl font-bold">Next JS</a>
                {
                    session ? (
                        <>
                            <span>Welcome {user.username || user.email}</span>
                            <button className="bg-red-600 py-1 px-3 rounded-xl" onClick={()=>signOut()}>LogOut</button>
                        </>
                    ) : (
                        <>
                        <Link href="/sign-in"><button>Sign In</button></Link>
                        </>
                    )
                }
            </nav>
        </div>
    );
}

export default NavBar;