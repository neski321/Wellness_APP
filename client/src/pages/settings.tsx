import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Settings() {
  const { toast } = useToast();
  const { user, loading, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "", username: user?.username || "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Demo auth actions
  const handleDemoLogin = async () => {
    try {
      await login("demo@example.com", "demo123");
      toast({ title: "Logged in as demo user" });
    } catch (e: any) {
      toast({ title: "Login failed", description: e.message, variant: "destructive" });
    }
  };
  const handleDemoSignup = async () => {
    try {
      await signUp("demo@example.com", "demo123", "Demo User");
      toast({ title: "Signed up as demo user" });
    } catch (e: any) {
      toast({ title: "Signup failed", description: e.message, variant: "destructive" });
    }
  };
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast({ title: "Logged in with Google" });
    } catch (e: any) {
      toast({ title: "Google login failed", description: e.message, variant: "destructive" });
    }
  };
  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged out" });
  };
  const handleGuest = async () => {
    await signInAsGuest();
    toast({ title: "Signed in as guest" });
  };

  const handleToggle = (setting: string, value: boolean) => {
    toast({
      title: "Settings updated",
      description: `${setting} has been ${value ? "enabled" : "disabled"}.`,
    });
  };

  const handleDeleteAccount = async () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await apiRequest("DELETE", `/api/users/${user.id}`);
      toast({ title: "Account deleted" });
      await logout();
      setDeleteDialogOpen(false);
    } catch (e: any) {
      toast({ title: "Failed to delete account", description: e.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const handleEditProfile = () => {
    setProfileForm({ name: user?.name || "", email: user?.email || "", username: user?.username || "" });
    setProfileError(null);
    setEditProfileOpen(true);
  };
  const handleChangePassword = () => {
    setPasswordForm({ oldPassword: "", newPassword: "" });
    setPasswordError(null);
    setChangePasswordOpen(true);
  };
  const submitEditProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
    setProfileError(null);
    try {
      const res = await apiRequest("PATCH", `/api/users/${user.id}`, profileForm);
      toast({ title: "Profile updated" });
      setEditProfileOpen(false);
    } catch (e: any) {
      setProfileError(e.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };
  const submitChangePassword = async () => {
    if (!user) return;
    setPasswordLoading(true);
    setPasswordError(null);
    try {
      await apiRequest("PATCH", `/api/users/${user.id}`, { password: passwordForm.newPassword, oldPassword: passwordForm.oldPassword });
      toast({ title: "Password changed" });
      setChangePasswordOpen(false);
    } catch (e: any) {
      setPasswordError(e.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const settingsSections = [
    {
      title: "Account",
      icon: <User className="w-5 h-5" />,
      items: [
        {
          title: "Profile Information",
          description: "Update your name, email, and other details",
          action: "Edit",
          onClick: !user?.isGuest ? handleEditProfile : undefined,
          disabled: !!user?.isGuest
        },
        {
          title: "Change Password",
          description: "Update your account password",
          action: "Change",
          onClick: !user?.isGuest ? handleChangePassword : undefined,
          disabled: !!user?.isGuest
        },
        {
          title: "Delete Account",
          description: "Permanently delete your account and data",
          action: "Delete",
          destructive: true,
          onClick: handleDeleteAccount
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
    <div className="max-w-md mx-auto px-4 py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div>Loading...</div>
          ) : user ? (
            <>
              <div className="font-medium text-lg">
                {user.isGuest ? "Guest User" : user.name || user.email}
              </div>
              {!user.isGuest && user.email && (
                <div className="text-gray-500 text-sm">{user.email}</div>
              )}
              <Button onClick={logout} className="mt-2">Logout</Button>
            </>
          ) : (
            <div>Please use the Login / Sign Up / Guest button in the header.</div>
          )}
        </CardContent>
      </Card>
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
                ) : item.disabled ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button 
                            variant={item.destructive ? "destructive" : "outline"}
                            size="sm"
                            className="ml-4"
                            disabled
                          >
                            {item.action}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Sign up to access this feature</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button 
                    variant={item.destructive ? "destructive" : "outline"}
                    size="sm"
                    className="ml-4"
                    onClick={item.onClick}
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

      {/* Dialog for account deletion confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-center">
            <p className="text-red-600 font-semibold mb-2">This action is permanent!</p>
            <p>Are you sure you want to permanently delete your account and all data? This cannot be undone.</p>
          </div>
          <DialogFooter className="flex flex-row gap-2 justify-center">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteAccount} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {profileError && <div className="text-red-500 text-sm text-center">{profileError}</div>}
            <Input
              placeholder="Name"
              value={profileForm.name}
              onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
              disabled={profileLoading}
            />
            <Input
              placeholder="Email"
              type="email"
              value={profileForm.email}
              onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
              disabled={profileLoading}
            />
            <Input
              placeholder="Username"
              value={profileForm.username}
              onChange={e => setProfileForm(f => ({ ...f, username: e.target.value }))}
              disabled={profileLoading}
            />
          </div>
          <DialogFooter className="flex flex-row gap-2 justify-center mt-4">
            <Button variant="outline" onClick={() => setEditProfileOpen(false)} disabled={profileLoading}>Cancel</Button>
            <Button onClick={submitEditProfile} disabled={profileLoading}>{profileLoading ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {passwordError && <div className="text-red-500 text-sm text-center">{passwordError}</div>}
            <Input
              placeholder="Old Password"
              type="password"
              value={passwordForm.oldPassword}
              onChange={e => setPasswordForm(f => ({ ...f, oldPassword: e.target.value }))}
              disabled={passwordLoading}
            />
            <Input
              placeholder="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
              disabled={passwordLoading}
            />
          </div>
          <DialogFooter className="flex flex-row gap-2 justify-center mt-4">
            <Button variant="outline" onClick={() => setChangePasswordOpen(false)} disabled={passwordLoading}>Cancel</Button>
            <Button onClick={submitChangePassword} disabled={passwordLoading}>{passwordLoading ? "Saving..." : "Change Password"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
