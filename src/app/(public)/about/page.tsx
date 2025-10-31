// app/about/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Our Blog Platform</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            A modern, interactive blogging platform where creativity meets community. 
            Share your stories, engage with readers, and build your audience.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Join Community
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Start Writing
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Writers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Published Posts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Monthly Readers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500K+</div>
              <div className="text-gray-600">Community Comments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Platform Features</h2>
          
          <Tabs defaultValue="writers" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="writers">For Writers</TabsTrigger>
              <TabsTrigger value="readers">For Readers</TabsTrigger>
              <TabsTrigger value="admins">For Admins</TabsTrigger>
            </TabsList>
            
            <TabsContent value="writers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <EditIcon className="h-5 w-5 text-blue-600" />
                      Easy Publishing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Create and publish beautiful blog posts with our intuitive editor. Format text, add images, and schedule publications.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AnalyticsIcon className="h-5 w-5 text-green-600" />
                      Post Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Track your post performance with detailed analytics. Monitor views, likes, comments, and reader engagement.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CommunityIcon className="h-5 w-5 text-purple-600" />
                      Community Building
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Build your reader community. Respond to comments, gain followers, and establish your author presence.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="readers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookmarkIcon className="h-5 w-5 text-blue-600" />
                      Personalized Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Discover content tailored to your interests. Follow favorite writers and get recommendations based on your reading history.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <InteractionIcon className="h-5 w-5 text-green-600" />
                      Interactive Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Engage with content through likes, comments, and shares. Save articles for later and share with your network.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <NotificationIcon className="h-5 w-5 text-purple-600" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Stay updated with notifications for new posts from followed writers and responses to your comments.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="admins">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ModerationIcon className="h-5 w-5 text-blue-600" />
                      Content Moderation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Advanced moderation tools to manage posts, comments, and users. Automated filters and manual review options.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AnalyticsIcon className="h-5 w-5 text-green-600" />
                      Platform Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Comprehensive dashboard with platform-wide analytics. Track growth, engagement, and user activity metrics.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5 text-purple-600" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Complete user management system. Manage roles, permissions, and handle user reports efficiently.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Sign Up & Create</h3>
              <p className="text-gray-600">Join our community and start creating your blog posts with our easy-to-use editor.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Publish & Share</h3>
              <p className="text-gray-600">Publish your content and share it with our growing community of readers and writers.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Engage & Grow</h3>
              <p className="text-gray-600">Interact with your readers, respond to comments, and watch your audience grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Control Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Admin Features</Badge>
            <h2 className="text-4xl font-bold">Complete Platform Control</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              Powerful admin tools to manage your blogging community effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Full control over all platform content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Post Moderation</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <Progress value={85} className="w-full" />
                
                <div className="flex justify-between items-center">
                  <span>Comment Management</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <Progress value={90} className="w-full" />
                
                <div className="flex justify-between items-center">
                  <span>User Management</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <Progress value={75} className="w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Real-time platform insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Daily Active Users</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span>New Posts Today</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span>Comments This Week</span>
                  <span className="font-semibold">4,892</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Growth</span>
                  <span className="font-semibold text-green-600">+12.5%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/rashed.jpeg" />
                <AvatarFallback>RM</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">Rashed Mahmud</h3>
              <p className="text-blue-600 mb-2">Founder & CEO</p>
              <p className="text-gray-600">Leading the vision and growth of our blogging platform.</p>
            </div>

            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/barai.jpeg" />
                <AvatarFallback>SB</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">Sumon Barai</h3>
              <p className="text-green-600 mb-2">Head of Community</p>
              <p className="text-gray-600">Building and nurturing our amazing writer community.</p>
            </div>

            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/habibulla.jpeg" />
                <AvatarFallback>HI</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">Habibulla</h3>
              <p className="text-purple-600 mb-2">Tech Lead</p>
              <p className="text-gray-600">Ensuring our platform runs smoothly and securely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Blogging Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are already sharing their stories and building their audiences on our platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Icon Components
function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CommunityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function InteractionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </svg>
  );
}

function NotificationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM8.5 14.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ModerationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
