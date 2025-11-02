'use client'
import { useSingleUser } from '@/hooks/dashboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userUpdate } from '@/lib/api';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Edit2, Save, X } from 'lucide-react';
import UserBlog from '@/components/blog/UserBlog';

// Utility functions
const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "First_Time_using");
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_URL}`, {
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

const validateFile = (file: File): string | null => {
  if (!file.type.startsWith('image/')) return "Please select an image file";
  if (file.size > 5 * 1024 * 1024) return "Image size should be less than 5MB";
  return null;
};

const getInitials = (name: string): string => {
  return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
};

const UserProfilePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImageUrl: '',
  });
  const [initialFormData, setInitialFormData] = useState({
    name: '',
    email: '',
    profileImageUrl: '',
  });

  const queryClient = useQueryClient();

  // Get userId from localStorage on client side
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  const { data: userData, isLoading, isError } = useSingleUser(userId || '');
  
  console.log('Full user data:', userData);
  console.log('User data structure:', userData?.data);

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) => userUpdate(id, data),
    onSuccess: () => {
      toast.success("Profile updated why  successfully");
      queryClient.invalidateQueries({ queryKey: ['singleuser', userId] });
      setIsEditing(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // Set form data when user data is loaded - ONLY ONCE
  useEffect(() => {
    if (userData && !isEditing) { // Only set data when not editing
      const user = userData.data || userData;
      console.log('Setting form data with user:', user);
      
      if (user) {
        const newFormData = {
          name: user.name || '',
          email: user.email || '',
          profileImageUrl: user.profileImageUrl || '',
        };
        setFormData(newFormData);
        setInitialFormData(newFormData); // Store initial data for cancel
      }
    }
  }, [userData, isEditing]); // Add isEditing to dependency array

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileError = validateFile(file);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, profileImageUrl: imageUrl }));
      toast.success("Image uploaded why successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    const data = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      profileImageUrl: formData.profileImageUrl,
    };

    updateMutation.mutate({ id: userId, data });
  };

  const handleCancel = () => {
    // Reset to initial data
    setFormData(initialFormData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Get the actual user object for display
  const user = userData ? (userData.data || userData) : null;

  if (isLoading) {
    return (
      <section>
        <div className='container mx-auto py-20'>
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading profile...</span>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section>
        <div className='container mx-auto py-20'>
          <div className="text-center">
            <h2 className='text-3xl font-semibold text-red-600 mb-4'>Error Loading Profile</h2>
            <p className="text-muted-foreground">Please try again later</p>
            <p className="text-sm text-muted-foreground mt-2">User ID: {userId}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className='container mx-auto py-8'>
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold">User Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-gray-200">
                <AvatarImage 
                  src={formData.profileImageUrl} 
                  alt={formData.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl bg-gray-100">
                  {getInitials(formData.name)}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <div className="text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP up to 5MB
                  </p>
                </div>
              )}
            </div>

            {/* User Information Form */}
            <form onSubmit={handleSave} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  readOnly={!isEditing}
                  className="w-full"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  readOnly={!isEditing}
                  className="w-full"
                  placeholder="Enter your email"
                />
              </div>

              {/* Read-only Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Role</Label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    <span className={user.isSuspended ? "text-red-600" : "text-green-600"}>
                      {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Member Since</Label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">User ID</Label>
                  <div className="p-2 border rounded-md bg-gray-50 font-mono text-xs">
                    {user._id}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <UserBlog />
      </div>
    </section>
  );
}

export default UserProfilePage;