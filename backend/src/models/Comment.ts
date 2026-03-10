import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  text: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true, maxlength: 300 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);