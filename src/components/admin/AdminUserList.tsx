"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";

interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleName: string;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

interface AdminUserListProps {
    users: AdminUser[];
    isLoading: boolean;
}

export function AdminUserList({ users, isLoading }: AdminUserListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
            </div>
        );
    }

    return (
        <Card className="bg-dark-800/50 backdrop-blur-sm border-neutral-700/50 shadow-dark-md">
            <CardHeader>
                <CardTitle className="text-white">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-neutral-700/50">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-neutral-700/50 hover:bg-dark-700/50">
                                <TableHead className="text-neutral-300">Name</TableHead>
                                <TableHead className="text-neutral-300">Email</TableHead>
                                <TableHead className="text-neutral-300">Role</TableHead>
                                <TableHead className="text-neutral-300">Status</TableHead>
                                <TableHead className="text-neutral-300">Last Login</TableHead>
                                <TableHead className="text-neutral-300">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow className="border-neutral-700/50">
                                    <TableCell colSpan={6} className="h-24 text-center text-neutral-400">
                                        No admin users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id} className="border-neutral-700/50 hover:bg-dark-700/50">
                                        <TableCell className="font-medium text-white">
                                            {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell className="text-neutral-300">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize border-neutral-600 text-neutral-300">
                                                {user.roleName?.replace('_', ' ') || 'N/A'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={user.isActive ? "default" : "destructive"}
                                                className={user.isActive ? "bg-success-500 hover:bg-success-600" : ""}
                                            >
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-neutral-300">
                                            {user.lastLoginAt
                                                ? format(new Date(user.lastLoginAt), "MMM d, yyyy HH:mm")
                                                : "Never"}
                                        </TableCell>
                                        <TableCell className="text-neutral-300">
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
