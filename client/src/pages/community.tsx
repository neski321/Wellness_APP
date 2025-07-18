import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, Heart, MessageCircle, Send, Shield, Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/AuthContext";

export default function Community() {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);

  // Custom event to open AuthModal from anywhere
  const openAuthModal = () => {
    window.dispatchEvent(new CustomEvent("open-auth-modal"));
  };

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["/api/community/posts"],
    queryFn: async () => {
      const response = await fetch("/api/community/posts?limit=20");
      if (!response.ok) return { posts: [] };
      return response.json();
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; anonymous: boolean }) => {
      if (!user) throw new Error("No user");
      const response = await apiRequest("POST", "/api/community/posts", {
        userId: user.id,
        content: postData.content,
        anonymous: postData.anonymous
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setNewPostContent("");
      setShowPostForm(false);
      toast({
        title: "Post shared successfully!",
        description: "Your message has been shared with the community.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error sharing post",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("POST", `/api/community/posts/${postId}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
    }
  });

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;
    
    createPostMutation.mutate({
      content: newPostContent.trim(),
      anonymous: isAnonymous
    });
  };

  const handleLikePost = (postId: number) => {
    likePostMutation.mutate(postId);
  };

  const getInitials = (anonymous: boolean, id: number) => {
    if (anonymous) return "A";
    return String.fromCharCode(65 + (id % 26));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return (
    <div className="p-8 text-center">
      <div className="mb-4">Please log in or sign up to access the community.</div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={openAuthModal}>Login / Sign Up</button>
    </div>
  );
  if (user.isGuest) return (
    <div className="p-8 text-center">
      <div className="mb-4">Guest users cannot access the community features.</div>
      <div className="mb-4 text-gray-500">Sign up or log in to join the community and share your thoughts!</div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={openAuthModal}>Login / Sign Up</button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">Share your journey and support others</p>
      </div>

      {/* Community Guidelines */}
      <Card className="border-[hsl(207,90%,54%)] border-l-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[hsl(207,90%,54%)]" />
            <h3 className="font-semibold text-gray-900">Safe Space Guidelines</h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Be kind and supportive to all members</li>
            <li>• Share experiences, not advice</li>
            <li>• Respect privacy and anonymity</li>
            <li>• Report concerning content</li>
          </ul>
        </CardContent>
      </Card>

      {/* Create Post Section */}
      {!showPostForm ? (
        <Button 
          onClick={() => setShowPostForm(true)}
          className="w-full bg-[hsl(207,90%,54%)] text-white hover:bg-[hsl(207,90%,49%)]"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Share Your Experience
        </Button>
      ) : (
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[hsl(207,90%,54%)]" />
              Share with Community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts, feelings, or experiences..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous" className="text-sm">
                Post anonymously
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmitPost}
                disabled={!newPostContent.trim() || createPostMutation.isPending}
                className="flex-1 bg-[hsl(207,90%,54%)] text-white hover:bg-[hsl(207,90%,49%)]"
              >
                <Send className="w-4 h-4 mr-2" />
                {createPostMutation.isPending ? "Sharing..." : "Share"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowPostForm(false);
                  setNewPostContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="card-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : postsData?.posts?.length > 0 ? (
          postsData.posts.map((post: any) => (
            <Card key={post.id} className="card-shadow hover:card-shadow-hover transition-gentle">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(142,71%,45%)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials(post.anonymous, post.id)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {post.anonymous && (
                        <Badge variant="secondary" className="text-xs">
                          Anonymous
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-[hsl(207,90%,54%)] transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share your experience with the community</p>
            <Button 
              onClick={() => setShowPostForm(true)}
              className="bg-[hsl(207,90%,54%)] text-white hover:bg-[hsl(207,90%,49%)]"
            >
              Share Your Story
            </Button>
          </div>
        )}
      </div>

      {/* Community Stats */}
      <Card className="card-shadow bg-gradient-to-r from-[hsl(207,90%,94%)] to-[hsl(142,71%,95%)]">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Community Impact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-[hsl(207,90%,54%)]">
                  {postsData?.posts?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Stories Shared</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[hsl(142,71%,45%)]">
                  {postsData?.posts?.reduce((sum: number, post: any) => sum + post.likes, 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Hearts Given</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
