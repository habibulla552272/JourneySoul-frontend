"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  Edit2,
  UserPlus,
  Loader2,
  Ban,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { allUserData, userDelete, userUpdate } from "@/lib/api";
import { toast } from "sonner";
import { User } from "@/hooks/dashboard";

// Utility functions
const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "First_Time_using");
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/dgxpnxsm7/image/upload`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) throw new Error("Upload failed");
    
    const result = await res.json();
    const secureUrl = result.secure_url;
    
    if (!secureUrl) {
      throw new Error("No valid image URL returned");
    }
    
    return secureUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Image upload failed");
  }
};

const validateUserForm = (formData: { name: string; email: string }): string | null => {
  if (!formData.name.trim()) return "Name is required";
  if (!formData.email.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email is invalid";
  return null;
};

const validateFile = (file: File): string | null => {
  if (!file.type.startsWith('image/')) return "Please select an image file";
  if (file.size > 5 * 1024 * 1024) return "Image size should be less than 5MB";
  return null;
};

const getUserInitials = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const formatJoinDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getPaginatedUsers = (users: User[], currentPage: number, usersPerPage: number) => {
  const startIndex = (currentPage - 1) * usersPerPage;
  return users.slice(startIndex, startIndex + usersPerPage);
};

const getTotalPages = (users: User[], usersPerPage: number): number => {
  return Math.ceil(users.length / usersPerPage);
};

export default function UsersPage() {
  const queryClient = useQueryClient();

  // ✅ Fetch all users
  const {
    data: userdata,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: allUserData,
  });

  // ✅ Mutations (Only delete and update - create removed)
  const deleteMutation = useMutation({
    mutationFn: userDelete,
    onSuccess: (data) => {
      toast.success(data.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userUpdate(id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowModal(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // ✅ Local states
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImageUrl: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const users = userdata?.data || [];

  // ✅ Pagination using utility functions
  const totalPages = getTotalPages(users, usersPerPage);
  const currentUsers = useMemo(() => 
    getPaginatedUsers(users, currentPage, usersPerPage),
    [users, currentPage]
  );

  // ✅ Handlers
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl || "",
    });
    setShowModal(true);
  };

  // Remove create new user functionality
  const handleCreateNew = () => {
    toast.info("Create user functionality is not available");
    // You can remove this button entirely if not needed
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only allow editing existing users
    if (!editingUser) {
      toast.error("Cannot create new users");
      return;
    }

    // Validate form using utility function
    const validationError = validateUserForm(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const data = { 
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim()
    };

    updateMutation.mutate({ id: editingUser._id, data });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file using utility function
    const fileError = validateFile(file);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, profileImageUrl: imageUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    }
  };

  const handleStatusToggle = (user: User) => {
    updateMutation.mutate({
      id: user._id,
      data: { isSuspended: !user.isSuspended }
    });
  };

  const isLoadingMutation = updateMutation.isPending;

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2">Loading users...</span>
    </div>
  );
  
  if (isError) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-center">
        <Ban className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 text-lg">Failed to load users.</p>
        <p className="text-muted-foreground mt-2">Please try again later.</p>
      </div>
    </div>
  );



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Update and manage user accounts
          </p>
        </div>
        {/* Remove or disable the New User button */}
        <Button
          onClick={handleCreateNew}
          className="bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
          disabled
        >
          <UserPlus className="w-4 h-4 mr-2" />
          New User (Disabled)
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total: {users.length} users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user: User) => (
                  <tr key={user._id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={user.profileImageUrl} 
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      {formatJoinDate(user.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusToggle(user)}
                        disabled={updateMutation.isPending}
                        className={
                          user.isSuspended
                            ? "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 h-7"
                            : "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 h-7"
                        }
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </Button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user._id)}
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center">
                  <Ban className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
                  <p className="text-muted-foreground">No users available in the system</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(usersPerPage, currentUsers.length)} of{" "}
                {users.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2">
                  <AvatarImage 
                    src={formData.profileImageUrl} 
                    alt="Preview"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-muted">
                    {formData.name ? getUserInitials(formData.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {/* <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP up to 5MB
                  </p> */}
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                }}
                disabled={isLoadingMutation}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoadingMutation}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoadingMutation && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}