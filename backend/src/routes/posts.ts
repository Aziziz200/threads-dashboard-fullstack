import { ServerRoute } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { Like } from '../models/Like.js';
import { postSchema, commentSchema } from '../utils/validation.js';
import { io } from '../plugins/socket.js'; // we'll define io export

const routes: ServerRoute[] = [
  // Create post
  {
    method: 'POST',
    path: '/api/posts',
    options: {
      validate: { payload: postSchema },
    },
    handler: async (request, h) => {
      try {
        const { content } = request.payload as any;
        const userId = request.auth.credentials.userId;
        const post = new Post({ content, author: userId });
        await post.save();
        await post.populate('author', 'username');
        // Emit new post event
        io.emit('newPost', post);
        return h.response(post).code(201);
      } catch (err) {
        console.error(err);
        return Boom.internal();
      }
    },
  },
  // Get all posts (with pagination)
  {
    method: 'GET',
    path: '/api/posts',
    options: { auth: false },
    handler: async (request, h) => {
      try {
        const page = parseInt(request.query.page as string) || 1;
        const limit = parseInt(request.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const posts = await Post.find()
          .populate('author', 'username')
          .populate({
            path: 'comments',
            populate: { path: 'author', select: 'username' },
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
        return { posts, page, limit };
      } catch (err) {
        console.error(err);
        return Boom.internal();
      }
    },
  },
  // Add comment
  {
    method: 'POST',
    path: '/api/comments',
    options: {
      validate: { payload: commentSchema },
    },
    handler: async (request, h) => {
      try {
        const { text, postId } = request.payload as any;
        const userId = request.auth.credentials.userId;
        const post = await Post.findById(postId);
        if (!post) return Boom.notFound('Post not found');
        const comment = new Comment({ text, author: userId, post: postId });
        await comment.save();
        await comment.populate('author', 'username');
        post.comments.push(comment._id);
        await post.save();
        // Emit new comment
        io.emit('newComment', { postId, comment });
        return h.response(comment).code(201);
      } catch (err) {
        console.error(err);
        return Boom.internal();
      }
    },
  },
  // Toggle like
  {
    method: 'POST',
    path: '/api/posts/{postId}/like',
    options: {},
    handler: async (request, h) => {
      try {
        const postId = request.params.postId;
        const userId = request.auth.credentials.userId;
        const existing = await Like.findOne({ user: userId, post: postId });
        if (existing) {
          await existing.deleteOne();
          await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
          io.emit('unlike', { postId, userId });
          return { liked: false };
        } else {
          const like = new Like({ user: userId, post: postId });
          await like.save();
          await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
          io.emit('like', { postId, userId });
          return { liked: true };
        }
      } catch (err) {
        console.error(err);
        return Boom.internal();
      }
    },
  },
];

export default routes;