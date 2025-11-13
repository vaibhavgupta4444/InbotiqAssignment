"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  HelpCircle,
  Users,
  BarChart3,
  Shield,
  User
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    
    if (!userData) {
      // If no user data, redirect to sign-in
      router.push("/sign-in");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      router.push("/sign-in");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    // Redirect to sign-in
    router.push("/sign-in");
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "0":
        return "User";
      case "1":
        return "Admin";
      default:
        return "User";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 mx-auto"></div>
          <p className="mt-4 text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
                <p className="text-xs text-slate-500">Welcome back!</p>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <Badge variant={user.role === "1" ? "default" : "secondary"} className="text-xs">
                  {user.role === "1" ? (
                    <><Shield className="mr-1 h-3 w-3" /> Admin</>
                  ) : (
                    <><User className="mr-1 h-3 w-3" /> User</>
                  )}
                </Badge>
              </div>
              <Avatar className="h-10 w-10 border-2 border-slate-200">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome, {user.name}!
          </h2>
          <p className="text-slate-600">
            {user.role === "1" 
              ? "You have full administrative access to manage the system." 
              : "Here's an overview of your account and quick actions."}
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Account Info Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <User className="h-4 w-4" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-semibold text-slate-900">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="text-sm font-semibold text-slate-900">
                  {user.role === "1" ? "Administrator" : "Standard User"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">0</div>
              <p className="text-xs text-slate-500 mt-1">Total Items</p>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-900">Active</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              {user.role === "1" 
                ? "Administrative tools and management options" 
                : "Common tasks and settings"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {user.role === "1" ? (
                <>
                  <Button 
                    onClick={() => router.push("/items")} 
                    className="h-auto py-4 flex-col items-start bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <FileText className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Manage All Items</span>
                    <span className="text-xs opacity-90">View and edit all user items</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col items-start hover:bg-slate-50"
                  >
                    <Users className="h-5 w-5 mb-2" />
                    <span className="font-semibold">User Management</span>
                    <span className="text-xs text-slate-600">Manage user accounts</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col items-start hover:bg-slate-50"
                  >
                    <BarChart3 className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Reports</span>
                    <span className="text-xs text-slate-600">View system analytics</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col items-start hover:bg-slate-50"
                  >
                    <Settings className="h-5 w-5 mb-2" />
                    <span className="font-semibold">System Settings</span>
                    <span className="text-xs text-slate-600">Configure system</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => router.push("/items")} 
                    className="h-auto py-4 flex-col items-start bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    <FileText className="h-5 w-5 mb-2" />
                    <span className="font-semibold">My Items</span>
                    <span className="text-xs opacity-90">Manage your items</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col items-start hover:bg-slate-50"
                  >
                    <User className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Profile</span>
                    <span className="text-xs text-slate-600">Update your information</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col items-start hover:bg-slate-50"
                  >
                    <Settings className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Settings</span>
                    <span className="text-xs text-slate-600">Customize preferences</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex-col items-start hover:bg-slate-50"
                  >
                    <HelpCircle className="h-5 w-5 mb-2" />
                    <span className="font-semibold">Help & Support</span>
                    <span className="text-xs text-slate-600">Get assistance</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;
