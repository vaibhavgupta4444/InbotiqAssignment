"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Item {
  _id: string;
  title: string;
  description: string;
  status: "active" | "inactive" | "completed";
  userId: any;
  createdAt: string;
  updatedAt: string;
}

const ItemsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active" as "active" | "inactive" | "completed",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/sign-in");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchItems(parsedUser.id);
    } catch (error) {
      router.push("/sign-in");
    }
  }, [router]);

  const fetchItems = async (userId?: string, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (userId && user?.role !== "1") {
        params.append("userId", userId);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/items?${params}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.items);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchItems(user.id);
    }
  }, [searchTerm, statusFilter]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ title: "", description: "", status: "active" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      status: item.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const url = editingItem
        ? `/api/items/${editingItem._id}`
        : "/api/items";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsDialogOpen(false);
        fetchItems(user.id, currentPage);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to save item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/items/${id}?userId=${user.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchItems(user.id, currentPage);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: "default",
      inactive: "secondary",
      completed: "outline",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/sign-in");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Items Management</h1>
            <p className="text-sm text-slate-600">
              {user.role === "1" ? "Admin View - All Items" : "Your Items"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Item" : "Create New Item"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Update the item details below"
                      : "Add a new item to your list"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive" | "completed") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Table */}
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                {user.role === "1" && <TableHead>Owner</TableHead>}
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={user.role === "1" ? 6 : 5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={user.role === "1" ? 6 : 5} className="text-center">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    {user.role === "1" && (
                      <TableCell>
                        {item.userId?.name || "Unknown"}
                      </TableCell>
                    )}
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchItems(user.id, currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchItems(user.id, currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ItemsPage;
