'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/lib/api';
import LikeButton from './LikeButton';
import CommentList from './CommentList';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  content: string;
  author: { _id: string; username: string };
  likes: string[];
  comments: any[];
  createdAt: string;
}

interface Props {
  post: Post;
  currentUser: { id: string };
}

export default function PostItem({ post, currentUser }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await api.post('/comments', { text: commentText, postId: post._id });
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-bold">@{post.author.username}</span>
          <span className="text-sm text-gray-500 ml-2">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      <p className="mb-3 whitespace-pre-wrap">{post.content}</p>
      <div className="flex items-center gap-4 mb-2">
        <LikeButton postId={post._id} likes={post.likes} currentUserId={currentUser.id} />
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-gray-500 hover:underline"
        >
          Comments ({post.comments.length})
        </button>
      </div>

      {showComments && (
        <div className="mt-3 border-t pt-3 dark:border-gray-700">
          <CommentList comments={post.comments} />
          <form onSubmit={handleComment} className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}