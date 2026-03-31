"use client"

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { UserCircle } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function LoginButton() {
    const t = useTranslations("Header");
    const { user, logout, status, hasSessionHint } = useAuth();
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
        return (
            <div className="flex items-center gap-2">
                {hasSessionHint ? (
                    <>
                        <Skeleton className="h-9 w-24 rounded-md" />
                        <Skeleton className="h-9 w-20 rounded-md" />
                    </>
                ) : (
                    <Skeleton className="h-9 w-[150px] rounded-md" />
                )}
            </div>
        )
    }

    if (error) {
        return <Button className="cursor-pointer" variant="outline" disabled>Error</Button>;
    }

    return (
        <>
            {status === 'unauthenticated' && !user && (
                <Link href="/login">
                    <Button className="cursor-pointer" variant="outline">
                        {t("loginSignup")}
                    </Button>
                </Link>
            )}

            {status === 'authenticated' && user && (
                <div className="flex items-center gap-2">
                    <Link href="/profile">
                        <Button variant="ghost">
                            <UserCircle className="w-5 h-5 mr-1" />
                            {t("profile")}
                        </Button>
                    </Link>

                    <Button onClick={handleLogout} className="cursor-pointer" variant="outline">
                        {t("logout")}
                    </Button>
                </div>
            )}
        </>
    )
}
