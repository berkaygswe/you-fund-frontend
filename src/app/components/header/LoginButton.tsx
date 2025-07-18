"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginButton(){

    const { user, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Button className="cursor-pointer" variant="outline" disabled>Loading...</Button>;
    }

    if (error) {
        return <Button className="cursor-pointer" variant="outline" disabled>Error</Button>;
    }

    return (
        <>
            {!loading && !user && (
                <Link href="/login">
                    <Button className="cursor-pointer" variant="outline">
                    Login / Signup
                    </Button>
                </Link>
            )}

            {!loading && user && (
                <div className="flex items-center gap-2">
                    <Link href="/profile">
                        <Button variant="ghost">
                        <UserCircle className="w-5 h-5 mr-1" />
                        Profile
                        </Button>
                    </Link>

                    <Button onClick={handleSubmit} className="cursor-pointer" variant="outline">
                        Logout
                    </Button>
                </div>
            )}
        </>
    )
}