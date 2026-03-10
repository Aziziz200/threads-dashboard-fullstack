'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSocket, disconnectSocket } from '@/lib/socket';
import api from '@/lib/api';
import PostItem from './PostItem';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  content: string;
  author: { _id: string; username: string };
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  _id: string;
  text: string;
  author: { _id: string; username: string };
  createdAt: string;
}

export default function PostList() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts?page=1&limit=20');
        setPosts(res.data.posts);
      } catch (error) {
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();

    // Socket connection
    const socket = getSocket(token);
    socket.on('newPost', (post: Post) => {
      setPosts((prev) => [post, ...prev]);
    });
    socket.on('newComment', ({ postId, comment }: { postId: string; comment: Comment }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: [...p.comments, comment] } : p
        )
      );
    });
    socket.on('like', ({ postId, userId }: { postId: string; userId: string }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: [...p.likes, userId] } : p
        )
      );
    });
    socket.on('unlike', ({ postId, userId }: { postId: string; userId: string }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: p.likes.filter((id) => id !== userId) } : p
        )
      );
    });

    return () => {
      socket.off('newPost');
      socket.off('newComment');
      socket.off('like');
      socket.off('unlike');
      disconnectSocket();
    };
  }, [token]);

  if (loading) return <div className="text-center p-4">Loading posts...</div>;

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet. Be the first!</p>
      ) : (
        posts.map((post) => <PostItem key={post._id} post={post} currentUser={user!} />)
      )}
    </div>
  );
}