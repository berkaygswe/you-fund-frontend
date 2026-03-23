"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginButton(){

    const { user, logout, status } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
            router.refresh();
            router.push('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Logout failed');
        }
    };

    if (status === 'loading') {
        return <Button className="cursor-pointer" variant="outline" disabled>Loading...</Button>;
    }

    if (error) {
        return <Button className="cursor-pointer" variant="outline" disabled>Error</Button>;
    }

    return (
        <>
            {status === 'unauthenticated' && !user && (
                <Link href="/login">
                    <Button className="cursor-pointer" variant="outline">
                    Login / Signup
                    </Button>
                </Link>
            )}

            {status === 'authenticated' && user && (
                <div className="flex items-center gap-2">
                    <Link href="/profile">
                        <Button variant="ghost">
                        <UserCircle className="w-5 h-5 mr-1" />
                        Profile
                        </Button>
                    </Link>

                    <Button onClick={handleLogout} className="cursor-pointer" variant="outline">
                        Logout
                    </Button>
                </div>
            )}
        </>
    )
}