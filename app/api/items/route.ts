import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";
import UserModel from "@/models/User"; // Import User model to register schema
import { itemSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

// GET all items (with filters, search, pagination)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Ensure User model is registered
    UserModel;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (userId) {
      query.userId = userId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    // Get total count for pagination
    const total = await Item.countDocuments(query);

    // Get items - populate manually to avoid schema registration issues
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Manually populate user data if needed
    const populatedItems = await Promise.all(
      items.map(async (item: any) => {
        if (item.userId) {
          const user = await UserModel.findById(item.userId).select("name email").lean();
          return { ...item, userId: user };
        }
        return item;
      })
    );

    return NextResponse.json(
      {
        success: true,
        items: populatedItems,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get items error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new item
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Validate input
    const validatedData = itemSchema.parse(body);

    // Check if userId is provided
    if (!body.userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Create item
    const item = await Item.create({
      ...validatedData,
      userId: body.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Item created successfully",
        item,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create item error:", error);

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
