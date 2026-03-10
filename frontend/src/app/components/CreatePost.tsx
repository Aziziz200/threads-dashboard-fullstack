'use client';

import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post('/posts', { content });
      setContent('');
      toast.success('Post created');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        rows={3}
        maxLength={500}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}