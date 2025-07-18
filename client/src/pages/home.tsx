import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Smile, Wind, Lightbulb, UserRoundSearch, Users, Phone, TriangleAlert, Brain, Flower2 } from "lucide-react";
import { MoodTracker } from "@/components/mood-tracker";
import { BreathingExercise } from "@/components/breathing-exercise";
import { InterventionCard } from "@/components/intervention-card";
import { ProgressChart } from "@/components/progress-chart";
import { CrisisResources } from "@/components/crisis-resources";
import ThoughtCheckin from "@/components/thought-checkin";
import QuickMeditation from "@/components/quick-meditation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Mock user ID for demo - in real app this would come from auth
const MOCK_USER_ID = 1;

export default function Home() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [showThoughtCheckin, setShowThoughtCheckin] = useState(false);
  const [showQuickMeditation, setShowQuickMeditation] = useState(false);

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ["/api/users", MOCK_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/users/${MOCK_USER_ID}`);
      if (!response.ok) {
        // Create user if not exists
        const createResponse = await apiRequest("POST", "/api/users", {
          username: "demo_user",
          email: "demo@example.com",
          password: "demo123",
          name: "Sarah"
        });
        return createResponse.json();
      }
      return response.json();
    }
  });

  // Fetch user progress
  const { data: progressData } = useQuery({
    queryKey: ["/api/progress", MOCK_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/progress/${MOCK_USER_ID}`);
      if (!response.ok) return null;
      return response.json();
    }
  });

  // Fetch weekly mood data
  const { data: weeklyMoodData } = useQuery({
    queryKey: ["/api/mood-entries", MOCK_USER_ID, "weekly"],
    queryFn: async () => {
      const response = await fetch(`/api/mood-entries/${MOCK_USER_ID}/weekly`);
      if (!response.ok) return { entries: [] };
      return response.json();
    }
  });

  // Fetch community posts
  const { data: communityData } = useQuery({
    queryKey: ["/api/community/posts"],
    queryFn: async () => {
      const response = await fetch("/api/community/posts?limit=3");
      if (!response.ok) return { posts: [] };
      return response.json();
    }
  });

  // Mood tracking mutation
  const moodMutation = useMutation({
    mutationFn: async (moodData: { mood: string; intensity: number; note?: string }) => {
      const response = await apiRequest("POST", "/api/mood-entries", {
        userId: MOCK_USER_ID,
        ...moodData
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      
      if (data.recommendation) {
        toast({
          title: "Mood logged successfully!",
          description: `Recommendation: ${data.recommendation.title}`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error logging mood",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleMoodSelect = (mood: string, intensity: number) => {
    setSelectedMood(mood);
    moodMutation.mutate({ mood, intensity });
  };

  const userName = userData?.user?.name || "there";
  const streak = progressData?.progress?.streak || 0;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 -mx-4 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">MindEase</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">{userName[0]?.toUpperCase()}</span>
            </div>
          </Button>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(142,71%,45%)] rounded-full flex items-center justify-center mb-4">
          <Smile className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Hello, {userName}</h2>
        <p className="text-gray-600">How are you feeling today?</p>
      </section>

      {/* Mood Tracker */}
      <MoodTracker 
        onMoodSelect={handleMoodSelect}
        selectedMood={selectedMood}
        isLoading={moodMutation.isPending}
      />

      {/* Micro-Interventions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Micro-Interventions</h3>
        
        {/* Breathing Exercise */}
        <InterventionCard
          title="Breathing Exercise"
          description="3 minutes • Stress Relief"
          icon={<Wind className="w-5 h-5 text-white" />}
          iconBg="bg-[hsl(142,71%,45%)]"
          gradient="intervention-gradient-breathing"
          onStart={() => setShowBreathingExercise(true)}
        />

        {/* CBT Prompt */}
        <InterventionCard
          title="Thought Check-In"
          description="5 minutes • CBT Exercise"
          icon={<Brain className="w-5 h-5 text-white" />}
          iconBg="bg-[hsl(207,90%,54%)]"
          gradient="bg-white"
          onStart={() => setShowThoughtCheckin(true)}
        />

        {/* Quick Meditation */}
        <InterventionCard
          title="Quick Meditation"
          description="3-5 minutes • Mindfulness"
          icon={<Flower2 className="w-5 h-5 text-white" />}
          iconBg="bg-purple-500"
          gradient="intervention-gradient-meditation"
          onStart={() => setShowQuickMeditation(true)}
        />
      </section>

      {/* Progress Section */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
            <Button variant="ghost" size="sm" className="text-[hsl(207,90%,54%)]">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[hsl(48,100%,67%)] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{streak}-day streak</p>
                  <p className="text-sm text-gray-600">Daily check-ins</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[hsl(48,100%,67%)]">{streak}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
            </div>

            <ProgressChart data={weeklyMoodData?.entries || []} />
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
          <Button variant="ghost" size="sm" className="text-[hsl(207,90%,54%)]">
            Browse All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Card className="card-shadow hover:card-shadow-hover transition-gentle cursor-pointer">
            <CardContent className="p-4">
              <div className="w-8 h-8 bg-[hsl(207,90%,94%)] rounded-full flex items-center justify-center mb-3">
                <div className="w-4 h-4 bg-[hsl(207,90%,54%)] rounded"></div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Articles</h4>
              <p className="text-xs text-gray-600">Evidence-based insights</p>
            </CardContent>
          </Card>

          <Card className="card-shadow hover:card-shadow-hover transition-gentle cursor-pointer">
            <CardContent className="p-4">
              <div className="w-8 h-8 bg-[hsl(142,71%,95%)] rounded-full flex items-center justify-center mb-3">
                <div className="w-4 h-4 bg-[hsl(142,71%,45%)] rounded"></div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Podcasts</h4>
              <p className="text-xs text-gray-600">Expert conversations</p>
            </CardContent>
          </Card>

          <Card className="card-shadow hover:card-shadow-hover transition-gentle cursor-pointer">
            <CardContent className="p-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Community</h4>
              <p className="text-xs text-gray-600">Anonymous support</p>
            </CardContent>
          </Card>

          <Card 
            className="card-shadow hover:card-shadow-hover transition-gentle cursor-pointer"
            onClick={() => setShowCrisisResources(true)}
          >
            <CardContent className="p-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Phone className="w-4 h-4 text-red-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Crisis Help</h4>
              <p className="text-xs text-gray-600">24/7 support lines</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Support */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Community Support</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-[hsl(142,71%,45%)] rounded-full"></div>
              <span className="text-xs text-gray-500">Active</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {communityData?.posts?.length > 0 ? (
              communityData.posts.slice(0, 1).map((post: any) => (
                <div key={post.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(142,71%,45%)] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <button className="text-xs text-gray-500 hover:text-[hsl(207,90%,54%)] transition-colors">
                          <Heart className="w-3 h-3 mr-1 inline" />
                          {post.likes}
                        </button>
                        <span className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No community posts yet</p>
                <p className="text-sm">Be the first to share your experience</p>
              </div>
            )}
          </div>
          
          <Button 
            className="w-full mt-4 bg-[hsl(207,90%,94%)] text-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,89%)] transition-colors"
            variant="secondary"
          >
            Join the Conversation
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Resources */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <TriangleAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Need Immediate Help?</h3>
              <p className="text-sm text-red-700">We're here for you 24/7</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              className="w-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={() => setShowCrisisResources(true)}
            >
              <Phone className="w-4 h-4 mr-2" />
              View Crisis Resources
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Exercise Modal */}
      {showBreathingExercise && (
        <BreathingExercise onClose={() => setShowBreathingExercise(false)} />
      )}

      {/* Crisis Resources Modal */}
      {showCrisisResources && (
        <CrisisResources onClose={() => setShowCrisisResources(false)} />
      )}

      {/* Thought Check-in Modal */}
      {showThoughtCheckin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Thought Check-In</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowThoughtCheckin(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4">
              <ThoughtCheckin onComplete={() => setShowThoughtCheckin(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Quick Meditation Modal */}
      {showQuickMeditation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quick Meditation</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowQuickMeditation(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-4">
              <QuickMeditation onComplete={() => setShowQuickMeditation(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
