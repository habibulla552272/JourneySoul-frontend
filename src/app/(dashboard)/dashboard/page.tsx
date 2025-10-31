"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAllBlog, useAllUserData, User } from "@/hooks/dashboard";
import { Users, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { BlogData } from "@/types/blog"; // Adjust import path as needed


export default function DashboardOverview() {
  const { data: userdata, isLoading: usersLoading, isError: usersError } = useAllUserData();
  const { data: blogData, isLoading: blogsLoading, isError: blogsError } = useAllBlog();

  const currentDate = new Date();

  // Safely get the last post
  const lastPost = blogData && blogData.length > 0 ? blogData[blogData.length - 1] : null;
  const lastPostDate = lastPost?.updatedAt ? new Date(lastPost.updatedAt) : null;

  let timeAgo = 'No posts yet';

  if (lastPostDate) {
    // Calculate the difference in milliseconds
    const timeDiff = currentDate.getTime() - lastPostDate.getTime();

    // Convert to different time units
    const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Format the output based on the time difference
    if (diffInYears > 0) {
      timeAgo = `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } else if (diffInMonths > 0) {
      timeAgo = `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
      timeAgo = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      timeAgo = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
  }

  // Calculate suspended users count
  const suspendedUsersCount = userdata?.users ? 
    userdata.users.filter((user: User) => user.isSuspended).length : 0;

  // Calculate growth percentage (example logic - adjust based on your needs)
  const totalUsers = userdata?.count || 0;
  const previousUsersCount = Math.max(0, totalUsers - 50); // Example: assume 50 new users
  const growthPercentage = previousUsersCount > 0 
    ? `${Math.round(((totalUsers - previousUsersCount) / previousUsersCount) * 100)}%`
    : "+0%";

  const stats = [
    {
      label: "Total Users",
      value: userdata?.count || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Total Posts",
      value: blogData?.length || 0,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      label: "Suspended Users",
      value: suspendedUsersCount,
      icon: AlertCircle,
      color: "bg-red-500",
    },
    {
      label: "Growth",
      value: growthPercentage,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  // Get latest user safely
  const latestUser = userdata?.users && userdata.users.length > 0 
    ? userdata.users[userdata.users.length - 1] 
    : null;

  const recentActivities = [
    {
      action: "User registered",
      user: latestUser?.name || "No users yet",
      time: "2 hours ago", // You might want to calculate this dynamically too
    },
    {
      action: "Post published",
      user: lastPost?.author?.name || "No posts yet",
      time: timeAgo,
    },
    {
      action: "User suspended",
      user: "Spam Account",
      time: "1 day ago",
    },
  ];

  if (usersLoading || blogsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (usersError || blogsError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Error loading dashboard data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s your blog management summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your blog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Active Users", value: "1,222", percentage: 99 },
                { label: "Published Posts", value: blogData?.length || 0, percentage: 98 },
                { label: "Engagement Rate", value: "87%", percentage: 87 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm font-bold">{item.value}</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}