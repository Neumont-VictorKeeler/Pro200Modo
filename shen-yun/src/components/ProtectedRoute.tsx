"use client";

import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {LoaderCircle} from "lucide-react";
import LoadingScreen from "@/components/ui/spinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [checkedAuth, setCheckedAuth] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else {
                setCheckedAuth(true);
            }
        }
    }, [user, loading, router]);

    if (loading || !checkedAuth) 
        return <LoadingScreen></LoadingScreen>;

    return <>{children}</>;


}

