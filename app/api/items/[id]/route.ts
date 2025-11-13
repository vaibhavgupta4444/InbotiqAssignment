import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";
import UserModel from "@/models/User"; // Import User model to register schema
import { itemSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

// GET single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const item = await Item.findById(id).lean();

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // Manually populate user data
    let populatedItem: any = item;
    if ((item as any).userId) {
      const user = await UserModel.findById((item as any).userId).select("name email").lean();
      populatedItem = { ...item, userId: user };
    }

    return NextResponse.json(
      {
        success: true,
        item: populatedItem,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get item error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const body = await request.json();
    
    // Validate input
    const validatedData = itemSchema.parse(body);

    // Find and update item
    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // Check if user owns the item (userId should be passed in request)
    if (body.userId && item.userId.toString() !== body.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update item
    Object.assign(item, validatedData);
    await item.save();

    return NextResponse.json(
      {
        success: true,
        message: "Item updated successfully",
        item,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update item error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // Check if user owns the item
    if (userId && item.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await Item.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Item deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete item error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
