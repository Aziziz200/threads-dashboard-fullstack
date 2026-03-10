'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostList from '@/components/PostList';
import CreatePost from '@/components/CreatePost';

export default function Dashboard() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (!user) return null;

  return (
    <main className="container mx-auto max-w-3xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Threads Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>@{user.username}</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      <CreatePost />
      <PostList />
    </main>
  );
}