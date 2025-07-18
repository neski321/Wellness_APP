import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Headphones, Users, Phone, ExternalLink, Heart, Brain, Lightbulb } from "lucide-react";

export default function Resources() {
  const categories = [
    {
      title: "Mental Health Articles",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-[hsl(207,90%,54%)]",
      lightColor: "bg-[hsl(207,90%,94%)]",
      items: [
        {
          title: "Understanding Anxiety: A Beginner's Guide",
          description: "Learn about anxiety symptoms, causes, and coping strategies",
          readTime: "5 min read",
          tags: ["Anxiety", "Coping"],
          url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders"
        },
        {
          title: "The Science of Stress and How to Manage It",
          description: "Evidence-based techniques for stress reduction",
          readTime: "8 min read",
          tags: ["Stress", "Science"],
          url: "https://www.apa.org/topics/stress"
        },
        {
          title: "Building Resilience in Daily Life",
          description: "Practical strategies to strengthen mental resilience",
          readTime: "6 min read",
          tags: ["Resilience", "Daily Life"],
          url: "https://www.cdc.gov/mentalhealth/stress-coping/cope-with-stress/index.html"
        }
      ]
    },
    {
      title: "Guided Meditations & Audio",
      icon: <Headphones className="w-5 h-5" />,
      color: "bg-[hsl(142,71%,45%)]",
      lightColor: "bg-[hsl(142,71%,95%)]",
      items: [
        {
          title: "10-Minute Morning Meditation",
          description: "Start your day with mindfulness and intention",
          readTime: "10 min",
          tags: ["Morning", "Mindfulness"],
          url: "https://www.headspace.com/meditation/10-minute-meditation"
        },
        {
          title: "Body Scan for Sleep",
          description: "Relax your body and mind before bedtime",
          readTime: "15 min",
          tags: ["Sleep", "Relaxation"],
          url: "https://www.calm.com/sleep/body-scan"
        },
        {
          title: "Anxiety Relief Breathing",
          description: "Guided breathing exercises for anxiety management",
          readTime: "7 min",
          tags: ["Anxiety", "Breathing"],
          url: "https://www.youtube.com/watch?v=YRPh_GaiL8s"
        }
      ]
    },
    {
      title: "Self-Help Tools",
      icon: <Lightbulb className="w-5 h-5" />,
      color: "bg-purple-500",
      lightColor: "bg-purple-100",
      items: [
        {
          title: "Thought Record Worksheet",
          description: "CBT tool for examining and reframing thoughts",
          readTime: "Interactive",
          tags: ["CBT", "Worksheet"],
          url: "https://www.psychologytools.com/resource/thought-record-sheet/"
        },
        {
          title: "Gratitude Journal Template",
          description: "Daily prompts for practicing gratitude",
          readTime: "5 min daily",
          tags: ["Gratitude", "Journal"],
          url: "https://www.happier.com/blog/gratitude-journal-template"
        },
        {
          title: "Mood Tracking Guide",
          description: "Learn effective mood tracking techniques",
          readTime: "3 min read",
          tags: ["Mood", "Tracking"],
          url: "https://www.verywellmind.com/mood-tracking-5323899"
        }
      ]
    },
    {
      title: "Educational Videos",
      icon: <Brain className="w-5 h-5" />,
      color: "bg-orange-500",
      lightColor: "bg-orange-100",
      items: [
        {
          title: "What Happens During a Panic Attack?",
          description: "Understanding panic attacks and coping strategies",
          readTime: "12 min",
          tags: ["Panic", "Education"],
          url: "https://www.ted.com/talks/dr_jennifer_akullian_what_happens_during_a_panic_attack"
        },
        {
          title: "The Mind-Body Connection",
          description: "How physical and mental health are interconnected",
          readTime: "8 min",
          tags: ["Mind-Body", "Health"],
          url: "https://www.harvard.edu/mind-body-medicine"
        },
        {
          title: "Healthy Sleep Habits",
          description: "Tips for improving sleep quality and mental health",
          readTime: "10 min",
          tags: ["Sleep", "Habits"],
          url: "https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep"
        }
      ]
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Resources</h1>
        <p className="text-gray-600">Evidence-based tools and information for mental wellness</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          className="card-shadow hover:card-shadow-hover transition-gentle cursor-pointer"
          onClick={() => window.open('https://988lifeline.org/', '_blank')}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Crisis Help</h3>
            <p className="text-xs text-gray-600">24/7 support lines</p>
          </CardContent>
        </Card>

        <Card 
          className="card-shadow hover:card-shadow-hover transition-gentle cursor-pointer"
          onClick={() => window.open('https://www.nami.org/Support-Education/Support-Groups', '_blank')}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Community</h3>
            <p className="text-xs text-gray-600">Peer support</p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Categories */}
      <div className="space-y-6">
        {categories.map((category, index) => (
          <Card key={index} className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center`}>
                  {category.icon}
                  <span className="text-white">{category.icon}</span>
                </div>
                <span className="text-gray-900">{category.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className={`p-4 ${category.lightColor} rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer`}
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex-1">{item.title}</h4>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{item.readTime}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Professional Help */}
      <Card className="card-shadow border-[hsl(207,90%,54%)] border-l-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[hsl(207,90%,94%)] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-[hsl(207,90%,54%)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Need Professional Help?</h3>
              <p className="text-sm text-gray-600">Consider speaking with a mental health professional</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full bg-[hsl(207,90%,54%)] text-white hover:bg-[hsl(207,90%,49%)]"
              onClick={() => window.open('https://www.psychologytoday.com/us/therapists', '_blank')}
            >
              Find a Therapist
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('https://www.betterhelp.com/advice/therapy/', '_blank')}
            >
              Learn About Therapy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> These resources are for educational purposes and are not a substitute for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a crisis helpline immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
