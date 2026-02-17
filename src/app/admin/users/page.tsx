"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminUserList } from "@/components/admin/AdminUserList";
import { CreateAdminModal } from "@/components/admin/CreateAdminModal";
import { AdminNavbar } from "@/components/layout/AdminNavbar";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { PremiumLoadingSkeleton } from "@/components/ui/PremiumLoadingSkeleton";

interface User {
    firstName: string;
    lastName: string;
    role: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch the list of admin users
    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/admin/users");
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                toast.error("Failed to fetch admin users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("An error occurred while fetching users");
        }
    };

    useEffect(() => {
        async function init() {
            try {
                // Fetch current user for Navbar
                const userResponse = await fetch('/api/auth/me');
                if (!userResponse.ok) {
                    router.push('/login');
                    return;
                }
                const userData = await userResponse.json();
                setUser(userData);

                // Fetch admin users list
                await fetchUsers();
            } catch (error) {
                console.error("Initialization error:", error);
            } finally {
                setIsLoading(false);
            }
        }

        init();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-950 font-sans text-white">
                <AdminNavbar user={user} />
                <main className="max-w-[1600px] mx-auto px-6 py-8">
                    <PremiumLoadingSkeleton />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-950 font-sans text-white relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <AdminNavbar user={user} />

            <main className="max-w-[1600px] mx-auto px-6 py-8 relative z-10">
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Shield className="w-6 h-6 text-gold-400" />
                                Admin Management
                            </h1>
                            <p className="text-neutral-400">
                                Manage system administrators and their roles.
                            </p>
                        </div>
                        <CreateAdminModal onSuccess={fetchUsers} />
                    </div>

                    <AdminUserList users={users} isLoading={isLoading} />
                </div>
            </main>
        </div>
    );
}
