"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Lock, Save, Loader2 } from "lucide-react"

import { toast } from "sonner"
import { useUserProfileData } from "@/hooks/dashboard"
import { userUpdate } from "@/lib/api"

export default function ProfilePage() {
  const { data, isError, isLoading, refetch } = useUserProfileData()
  const adminData = data?.data?.user

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    joinDate: "N/A"
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [isUpdating, setIsUpdating] = useState(false)
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" })

  // Initialize profile data when adminData is available
  useEffect(() => {
    if (adminData) {
      const profileData = {
        name: adminData.name || "",
        email: adminData.email || "",
        role: adminData.role || "",
        joinDate: adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : "N/A"
      }
      setProfile(profileData)
      setFormData(profileData)
    }
  }, [adminData])

  const handleSaveProfile = async () => {
    if (!adminData?._id) {
      toast.error("User ID not found")
      return
    }

    setIsUpdating(true)
    try {
      // Only send the fields that can be updated
      const updateData = {
        name: formData.name,
        email: formData.email,
        // Don't send role or joinDate as they typically shouldn't be updated via profile
      }

      await userUpdate(adminData._id, updateData)

      // Update local state
      setProfile(formData)
      setIsEditing(false)

      // Refetch to get latest data from server
      await refetch()

      toast.success("Profile updated successfully!")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = () => {
    if (passwordData.new === passwordData.confirm) {
      toast.success("Password changed successfully!")
      setPasswordData({ current: "", new: "", confirm: "" })
    } else {
      toast.error("Passwords do not match!")
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData(profile) // Reset form data to current profile data
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 min-h-64 flex items-center justify-center">
        Failed to load profile data
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={32} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="mt-1 font-medium">{profile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <p className="mt-1 font-medium">{profile.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                      <p className="mt-1 font-medium">{profile.joinDate}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isUpdating}
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUpdating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save size={16} className="mr-2" />
                      )}
                      {isUpdating ? "Updating..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-slate-300 hover:bg-slate-400 text-black"
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Card - Uncomment when ready */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Confirm new password"
                />
              </div>
              <Button onClick={handleChangePassword} className="w-full bg-blue-600 hover:bg-blue-700">
                <Lock size={16} className="mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}