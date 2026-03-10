import { formatDistanceToNow } from 'date-fns';

interface Comment {
  _id: string;
  text: string;
  author: { _id: string; username: string };
  createdAt: string;
}

interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return <p className="text-sm text-gray-500">No comments yet.</p>;
  }

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <div key={comment._id} className="text-sm">
          <span className="font-semibold">@{comment.author.username}</span>{' '}
          <span className="text-gray-700 dark:text-gray-300">{comment.text}</span>
          <span className="text-xs text-gray-400 ml-2">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
      ))}
    </div>
  );
}