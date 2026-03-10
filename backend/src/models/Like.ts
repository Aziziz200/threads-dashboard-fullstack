import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

// Ensure one like per user per post
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

export const Like = mongoose.model<ILike>('Like', LikeSchema);