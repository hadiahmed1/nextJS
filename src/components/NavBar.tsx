"use client"
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {User} from "next-auth"

const NavBar = () => {
    const {data} = useSession();
    return (
        <div>NavBar</div>
    );
}

export default NavBar;