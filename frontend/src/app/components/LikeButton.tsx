'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

interface Props {
  postId: string;
  likes: string[];
  currentUserId: string;
}

export default function LikeButton({ postId, likes, currentUserId }: Props) {
  const [liked, setLiked] = useState(likes.includes(currentUserId));
  const [count, setCount] = useState(likes.length);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await api.post(`/posts/${postId}/like`);
      // Optimistic update
      if (liked) {
        setLiked(false);
        setCount((c) => c - 1);
      } else {
        setLiked(true);
        setCount((c) => c + 1);
      }
    } catch (error) {
      // revert on error
      setLiked(likes.includes(currentUserId));
      setCount(likes.length);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition"
    >
      {liked ? (
        <HeartSolid className="w-5 h-5 text-red-500" />
      ) : (
        <HeartOutline className="w-5 h-5" />
      )}
      <span>{count}</span>
    </button>
  );
}