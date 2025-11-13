import mongoose, { Document, Model, Schema } from "mongoose";

export interface IItem {
  title: string;
  description: string;
  status: "active" | "inactive" | "completed";
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItemDocument extends IItem, Document {}

const itemSchema = new mongoose.Schema<IItemDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
itemSchema.index({ userId: 1, createdAt: -1 });
itemSchema.index({ title: 1 });

const Item: Model<IItemDocument> =
  mongoose.models.Item || mongoose.model<IItemDocument>("Item", itemSchema);

export default Item;
