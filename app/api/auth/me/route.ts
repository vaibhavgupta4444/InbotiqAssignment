import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// GET current user info
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get user ID from query params or cookie
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    // Also try to get from cookie
    const userCookie = request.cookies.get("user");
    let userIdFromCookie;
    
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie.value);
        userIdFromCookie = userData.id;
      } catch (e) {
        // Cookie parsing failed
      }
    }

    const finalUserId = userId || userIdFromCookie;

    if (!finalUserId) {
      return NextResponse.json(
        { success: false, message: "User ID not provided" },
        { status: 401 }
      );
    }

    // Find user by ID (exclude password)
    const user = await UserModel.findById(finalUserId).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
