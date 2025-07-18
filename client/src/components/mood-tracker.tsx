import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Smile, Meh, Frown, Heart, Zap } from "lucide-react";

interface MoodTrackerProps {
  onMoodSelect: (mood: string, intensity: number) => void;
  selectedMood: string | null;
  isLoading?: boolean;
}

const moods = [
  { 
    id: "joy", 
    label: "Joy", 
    icon: <Heart className="w-6 h-6" />,
    color: "mood-gradient-joy",
    intensity: 5
  },
  { 
    id: "calm", 
    label: "Calm", 
    icon: <Smile className="w-6 h-6" />,
    color: "mood-gradient-calm",
    intensity: 4
  },
  { 
    id: "neutral", 
    label: "Neutral", 
    icon: <Meh className="w-6 h-6" />,
    color: "mood-gradient-neutral",
    intensity: 3
  },
  { 
    id: "stressed", 
    label: "Stressed", 
    icon: <Zap className="w-6 h-6" />,
    color: "mood-gradient-stressed",
    intensity: 2
  },
  { 
    id: "anxious", 
    label: "Anxious", 
    icon: <Frown className="w-6 h-6" />,
    color: "mood-gradient-anxious",
    intensity: 1
  }
];

export function MoodTracker({ onMoodSelect, selectedMood, isLoading = false }: MoodTrackerProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const handleMoodClick = (mood: typeof moods[0]) => {
    onMoodSelect(mood.id, mood.intensity);
    
    // Set a sample recommendation based on mood
    const recommendations = {
      joy: "Keep up the positive energy! Try sharing your joy with the community.",
      calm: "Great to hear you're feeling calm. Consider a short meditation to maintain this state.",
      neutral: "It's perfectly normal to feel neutral. Try our breathing exercise to center yourself.",
      stressed: "Take a moment to breathe. Our 3-minute breathing exercise can help you reset.",
      anxious: "You're not alone in feeling anxious. Try our guided breathing or reach out to the community."
    };
    
    setRecommendation(recommendations[mood.id as keyof typeof recommendations]);
  };

  return (
    <Card className="card-shadow">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Track Your Mood</h3>
        
        <div className="grid grid-cols-5 gap-3 mb-4">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant="outline"
              className={cn(
                "flex flex-col items-center p-3 h-auto border-2 hover:border-[hsl(207,90%,54%)] transition-colors",
                mood.color,
                selectedMood === mood.id && "border-[hsl(207,90%,54%)] ring-2 ring-[hsl(207,90%,54%)] ring-opacity-50"
              )}
              onClick={() => handleMoodClick(mood)}
              disabled={isLoading}
            >
              <div className="text-gray-700 mb-2">
                {mood.icon}
              </div>
              <span className="text-xs text-gray-600">{mood.label}</span>
            </Button>
          ))}
        </div>

        {recommendation && (
          <div className="p-4 bg-[hsl(207,90%,94%)] rounded-xl">
            <p className="text-sm text-[hsl(207,90%,54%)] font-medium mb-1">
              Based on your mood, here's what we recommend:
            </p>
            <p className="text-xs text-gray-600">{recommendation}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-[hsl(207,90%,54%)] border-t-transparent rounded-full animate-spin"></div>
              Logging your mood...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
