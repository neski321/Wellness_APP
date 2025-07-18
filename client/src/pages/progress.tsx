import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Target, Brain, Award } from "lucide-react";
import { ProgressChart } from "@/components/progress-chart";

const MOCK_USER_ID = 1;

export default function Progress() {
  const { data: progressData } = useQuery({
    queryKey: ["/api/progress", MOCK_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/progress/${MOCK_USER_ID}`);
      if (!response.ok) return null;
      return response.json();
    }
  });

  const { data: moodData } = useQuery({
    queryKey: ["/api/mood-entries", MOCK_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/mood-entries/${MOCK_USER_ID}`);
      if (!response.ok) return { entries: [] };
      return response.json();
    }
  });

  const { data: interventionData } = useQuery({
    queryKey: ["/api/interventions", MOCK_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/interventions/${MOCK_USER_ID}`);
      if (!response.ok) return { interventions: [] };
      return response.json();
    }
  });

  const progress = progressData?.progress;
  const insights = progressData?.insights;
  const completedInterventions = interventionData?.interventions?.filter((i: any) => i.completed) || [];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your mental health journey</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="card-shadow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(48,100%,67%)] to-[hsl(48,100%,77%)] rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress?.streak || 0}</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(142,71%,45%)] to-[hsl(142,71%,55%)] rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{progress?.totalInterventions || 0}</p>
            <p className="text-sm text-gray-600">Interventions</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trends */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[hsl(207,90%,54%)]" />
            Mood Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressChart data={moodData?.entries || []} />
        </CardContent>
      </Card>

      {/* AI Insights */}
      {insights && (
        <Card className="card-shadow border-[hsl(207,90%,54%)] border-l-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(207,90%,54%)]">
              <Brain className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Pattern Analysis</h4>
              <p className="text-sm text-gray-700">{insights.pattern}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
              <p className="text-sm text-gray-700">{insights.recommendation}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {Math.round(insights.confidence * 100)}% confidence
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[hsl(142,71%,45%)]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedInterventions.length > 0 ? (
              completedInterventions.slice(0, 5).map((intervention: any) => (
                <div key={intervention.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{intervention.title}</p>
                    <p className="text-sm text-gray-600">{intervention.type} • {intervention.duration} min</p>
                  </div>
                  <Badge variant="secondary" className="bg-[hsl(142,71%,95%)] text-[hsl(142,71%,45%)]">
                    Completed
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No completed interventions yet</p>
                <p className="text-sm">Start your first intervention to see progress</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>This Week's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Check-ins</span>
              <span className="font-semibold">{moodData?.entries?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Interventions completed</span>
              <span className="font-semibold">{completedInterventions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current streak</span>
              <span className="font-semibold text-[hsl(48,100%,67%)]">{progress?.streak || 0} days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
