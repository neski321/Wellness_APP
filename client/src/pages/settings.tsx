import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Shield, 
  Heart, 
  HelpCircle, 
  Mail,
  User,
  Lock,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);

  const handleToggle = (setting: string, value: boolean) => {
    toast({
      title: "Settings updated",
      description: `${setting} has been ${value ? "enabled" : "disabled"}.`,
    });
  };

  const settingsSections = [
    {
      title: "Account",
      icon: <User className="w-5 h-5" />,
      items: [
        {
          title: "Profile Information",
          description: "Update your name, email, and other details",
          action: "Edit"
        },
        {
          title: "Change Password",
          description: "Update your account password",
          action: "Change"
        },
        {
          title: "Delete Account",
          description: "Permanently delete your account and data",
          action: "Delete",
          destructive: true
        }
      ]
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          title: "Data Sharing",
          description: "Share anonymized data for research purposes",
          toggle: true,
          value: dataSharing,
          onChange: (value: boolean) => {
            setDataSharing(value);
            handleToggle("Data sharing", value);
          }
        },
        {
          title: "Biometric Authentication",
          description: "Use fingerprint or face ID to secure the app",
          toggle: true,
          value: biometricAuth,
          onChange: (value: boolean) => {
            setBiometricAuth(value);
            handleToggle("Biometric authentication", value);
          }
        }
      ]
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          title: "Push Notifications",
          description: "Receive app notifications and updates",
          toggle: true,
          value: notifications,
          onChange: (value: boolean) => {
            setNotifications(value);
            handleToggle("Push notifications", value);
          }
        },
        {
          title: "Daily Check-in Reminders",
          description: "Gentle reminders to log your mood",
          toggle: true,
          value: dailyReminders,
          onChange: (value: boolean) => {
            setDailyReminders(value);
            handleToggle("Daily reminders", value);
          }
        }
      ]
    },
    {
      title: "Appearance",
      icon: <Moon className="w-5 h-5" />,
      items: [
        {
          title: "Dark Mode",
          description: "Use dark theme for better night viewing",
          toggle: true,
          value: darkMode,
          onChange: (value: boolean) => {
            setDarkMode(value);
            handleToggle("Dark mode", value);
          }
        }
      ]
    }
  ];

  const supportItems = [
    {
      title: "Help Center",
      description: "Find answers to common questions",
      icon: <HelpCircle className="w-5 h-5 text-[hsl(207,90%,54%)]" />
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: <Mail className="w-5 h-5 text-[hsl(142,71%,45%)]" />
    },
    {
      title: "Crisis Resources",
      description: "Access emergency mental health support",
      icon: <Heart className="w-5 h-5 text-red-500" />
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your MindEase experience</p>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {section.icon}
              </div>
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                
                {item.toggle ? (
                  <Switch
                    checked={item.value}
                    onCheckedChange={item.onChange}
                    className="ml-4"
                  />
                ) : (
                  <Button 
                    variant={item.destructive ? "destructive" : "outline"}
                    size="sm"
                    className="ml-4"
                  >
                    {item.action}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Support & Help */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            Support & Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {supportItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(142,71%,45%)] rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">MindEase</h3>
              <p className="text-sm text-gray-600">Mental Health Companion</p>
              <Badge variant="secondary" className="mt-2">
                Version 1.0.0
              </Badge>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>© 2024 MindEase. All rights reserved.</p>
              <div className="flex justify-center gap-4">
                <button className="hover:text-[hsl(207,90%,54%)] transition-colors">
                  Privacy Policy
                </button>
                <button className="hover:text-[hsl(207,90%,54%)] transition-colors">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
