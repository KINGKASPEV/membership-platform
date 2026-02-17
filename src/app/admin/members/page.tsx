'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemberCard } from '@/components/admin/MemberCard';
import { MemberDetailModal } from '@/components/admin/MemberDetailModal';

interface Member {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    phoneNumber: string;
    email?: string;
    status: string;
    stateName: string;
    lgaName: string;
    wardName: string;
    parishName: string;
    createdAt: string;
}

function MembersPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);
            if (searchQuery) params.set('search', searchQuery);
            params.set('page', page.toString());
            params.set('limit', '20');

            const response = await fetch(`/api/admin/members?${params}`);
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch members');
            }

            const data = await response.json();
            setMembers(data.members);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [statusFilter, searchQuery, page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchMembers();
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Header */}
            <header className="bg-dark-900/95 backdrop-blur-sm border-b border-neutral-700/50 shadow-dark-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Member Management</h1>
                        <p className="text-sm text-neutral-400">Review and validate member registrations</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => router.push('/admin/dashboard')}>
                            Dashboard
                        </Button>
                        <Button variant="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <Card className="mb-6 bg-dark-800/50 backdrop-blur-sm border-neutral-700/50">
                    <CardHeader>
                        <CardTitle className="text-white">Filters</CardTitle>
                        <CardDescription className="text-neutral-400">Search and filter member registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by name or phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => {
                                        setStatusFilter(value);
                                        setPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="validated">Validated</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Members List */}
                {isLoading ? (
                    <div className="text-center py-12 text-neutral-400">Loading members...</div>
                ) : members.length === 0 ? (
                    <Card className="bg-dark-800/50 backdrop-blur-sm border-neutral-700/50">
                        <CardContent className="py-12 text-center text-neutral-400">
                            No members found matching your criteria.
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {members.map((member) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    onClick={() => setSelectedMemberId(member.id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setPage((p) => Math.max(1, p - 1));
                                }}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 text-neutral-400">
                                Page {page}
                            </span>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setPage((p) => p + 1);
                                }}
                                disabled={!hasMore}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </main>

            {/* Member Detail Modal */}
            {selectedMemberId && (
                <MemberDetailModal
                    memberId={selectedMemberId}
                    onClose={() => setSelectedMemberId(null)}
                    onUpdate={fetchMembers}
                />
            )}
        </div>
    );
}

export default function MembersPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-secondary-600">Loading...</p></div>}>
            <MembersPageContent />
        </Suspense>
    );
}
