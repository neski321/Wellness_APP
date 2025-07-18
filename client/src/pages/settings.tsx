import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SettingsIcon, Bell, Moon, Shield, Heart, HelpCircle, Mail, User, Sparkles, Star, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/AuthContext"
import { apiRequest } from "@/lib/queryClient"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { auth } from "@/lib/firebase"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

const cardHoverVariants = {
  hover: {
    y: -2,
    scale: 1.01,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.99,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
}

export default function Settings() {
  const { toast } = useToast()
  const { user, loading, logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [dataSharing, setDataSharing] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleToggle = (setting: string, value: boolean) => {
    toast({
      title: "Settings updated",
      description: `${setting} has been ${value ? "enabled" : "disabled"}.`,
    })
  }

  const handleDeleteAccount = async () => {
    setDeleteDialogOpen(true)
  }

  const confirmDeleteAccount = async () => {
    if (!user) return
    setDeleting(true)
    try {
      await apiRequest("DELETE", `/api/users/${user.id}`)
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete()
        } catch (firebaseError: any) {
          if (firebaseError.code === "auth/requires-recent-login") {
            toast({
              title: "Please log in again to delete your account from Firebase.",
              description: "For security, please log out and log back in, then try deleting your account again.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Failed to delete Firebase account",
              description: firebaseError.message,
              variant: "destructive",
            })
          }
        }
      }
      toast({ title: "Account deleted" })
      await logout()
      setDeleteDialogOpen(false)
    } catch (e: any) {
      toast({ title: "Failed to delete account", description: e.message, variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  const handleEditProfile = () => {
    setProfileForm({ name: user?.name || "", email: user?.email || "", username: user?.username || "" })
    setProfileError(null)
    setEditProfileOpen(true)
  }

  const handleChangePassword = () => {
    setPasswordForm({ oldPassword: "", newPassword: "" })
    setPasswordError(null)
    setChangePasswordOpen(true)
  }

  const submitEditProfile = async () => {
    if (!user) return
    setProfileLoading(true)
    setProfileError(null)
    try {
      await apiRequest("PATCH", `/api/users/${user.id}`, profileForm)
      toast({ title: "Profile updated" })
      setEditProfileOpen(false)
    } catch (e: any) {
      setProfileError(e.message || "Failed to update profile")
    } finally {
      setProfileLoading(false)
    }
  }

  const submitChangePassword = async () => {
    if (!user) return
    setPasswordLoading(true)
    setPasswordError(null)
    try {
      await apiRequest("PATCH", `/api/users/${user.id}`, {
        password: passwordForm.newPassword,
        oldPassword: passwordForm.oldPassword,
      })
      toast({ title: "Password changed" })
      setChangePasswordOpen(false)
    } catch (e: any) {
      setPasswordError(e.message || "Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const settingsSections = [
    {
      title: "Account",
      icon: <User className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      items: [
        {
          title: "Profile Information",
          description: "Update your name, email, and other details",
          action: "Edit",
          onClick: !user?.isGuest ? handleEditProfile : undefined,
          disabled: !!user?.isGuest,
        },
        {
          title: "Change Password",
          description: "Update your account password",
          action: "Change",
          onClick: !user?.isGuest ? handleChangePassword : undefined,
          disabled: !!user?.isGuest,
        },
        {
          title: "Delete Account",
          description: "Permanently delete your account and data",
          action: "Delete",
          destructive: true,
          onClick: handleDeleteAccount,
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      items: [
        {
          title: "Data Sharing",
          description: "Share anonymized data for research purposes",
          toggle: true,
          value: dataSharing,
          onChange: (value: boolean) => {
            setDataSharing(value)
            handleToggle("Data sharing", value)
          },
        },
        {
          title: "Biometric Authentication",
          description: "Use fingerprint or face ID to secure the app",
          toggle: true,
          value: biometricAuth,
          onChange: (value: boolean) => {
            setBiometricAuth(value)
            handleToggle("Biometric authentication", value)
          },
        },
      ],
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      items: [
        {
          title: "Push Notifications",
          description: "Receive app notifications and updates",
          toggle: true,
          value: notifications,
          onChange: (value: boolean) => {
            setNotifications(value)
            handleToggle("Push notifications", value)
          },
        },
        {
          title: "Daily Check-in Reminders",
          description: "Gentle reminders to log your mood",
          toggle: true,
          value: dailyReminders,
          onChange: (value: boolean) => {
            setDailyReminders(value)
            handleToggle("Daily reminders", value)
          },
        },
      ],
    },
    {
      title: "Appearance",
      icon: <Moon className="w-5 h-5" />,
      color: "from-indigo-500 to-purple-500",
      items: [
        {
          title: "Dark Mode",
          description: "Use dark theme for better night viewing",
          toggle: true,
          value: darkMode,
          onChange: (value: boolean) => {
            setDarkMode(value)
            handleToggle("Dark mode", value)
          },
        },
      ],
    },
  ]

  const supportItems = [
    {
      title: "Help Center",
      description: "Find answers to common questions",
      icon: <HelpCircle className="w-5 h-5 text-blue-500" />,
      color: "from-blue-50 to-cyan-50",
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: <Mail className="w-5 h-5 text-green-500" />,
      color: "from-green-50 to-emerald-50",
    },
    {
      title: "Crisis Resources",
      description: "Access emergency mental health support",
      icon: <Phone className="w-5 h-5 text-red-500" />,
      color: "from-red-50 to-pink-50",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto px-4 py-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 text-lg">Customize your MindEase experience</p>
        </motion.div>

        {/* Account Overview */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {user.isGuest ? "G" : (user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">
                        {user.isGuest ? "Guest User" : user.name || user.email}
                      </p>
                      {!user.isGuest && user.email && <p className="text-sm text-gray-600">{user.email}</p>}
                      <Badge
                        className={`mt-2 ${
                          user.isGuest
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : "bg-green-100 text-green-700 border-green-200"
                        } rounded-full`}
                      >
                        {user.isGuest ? "Guest Account" : "Full Account"}
                      </Badge>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
                    <Button
                      onClick={logout}
                      variant="outline"
                      className="w-full rounded-2xl border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Please use the Login / Sign Up button in the header.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <motion.div key={sectionIndex} variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    {section.icon}
                  </div>
                  <span className="text-xl font-bold text-gray-800">{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: itemIndex * 0.1 }}
                    whileHover="hover"
                    variants={cardHoverVariants}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>

                    {item.toggle ? (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Switch checked={item.value} onCheckedChange={item.onChange} className="ml-4" />
                      </motion.div>
                    ) : item.disabled ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button
                                variant={item.destructive ? "destructive" : "outline"}
                                size="sm"
                                className="ml-4 rounded-full"
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
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={item.destructive ? "destructive" : "outline"}
                          size="sm"
                          className="ml-4 rounded-full"
                          onClick={item.onClick}
                        >
                          {item.action}
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Support & Help */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">Support & Help</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${item.color} rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer`}
                >
                  <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-md">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* App Information */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-2">MindEase</h3>
                  <p className="text-gray-600 mb-4">Mental Health Companion</p>
                  <Badge className="bg-white/60 text-purple-700 border-purple-200 rounded-full px-4 py-2">
                    <Star className="w-3 h-3 mr-1" />
                    Version 1.0.0
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>© 2024 MindEase. All rights reserved.</p>
                  <div className="flex justify-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hover:text-purple-600 transition-colors font-medium"
                    >
                      Privacy Policy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hover:text-purple-600 transition-colors font-medium"
                    >
                      Terms of Service
                    </motion.button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dialogs */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Delete Account</DialogTitle>
              <DialogDescription className="text-gray-600">
                This action is permanent and will remove all your data from MindEase.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-bold mb-2">This action is permanent!</p>
              <p className="text-gray-700">
                Are you sure you want to permanently delete your account and all data? This cannot be undone.
              </p>
            </div>
            <DialogFooter className="flex flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteAccount} disabled={deleting} className="rounded-full">
                {deleting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Edit Profile</DialogTitle>
              <DialogDescription className="text-gray-600">
                Update your name, email, or username for your account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {profileError && (
                <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-2xl">{profileError}</div>
              )}
              <Input
                placeholder="Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                disabled={profileLoading}
                className="rounded-2xl"
              />
              <Input
                placeholder="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                disabled={profileLoading}
                className="rounded-2xl"
              />
              <Input
                placeholder="Username"
                value={profileForm.username}
                onChange={(e) => setProfileForm((f) => ({ ...f, username: e.target.value }))}
                disabled={profileLoading}
                className="rounded-2xl"
              />
            </div>
            <DialogFooter className="flex flex-row gap-3 justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setEditProfileOpen(false)}
                disabled={profileLoading}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button onClick={submitEditProfile} disabled={profileLoading} className="rounded-full">
                {profileLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Change Password</DialogTitle>
              <DialogDescription className="text-gray-600">
                Enter your old password and a new password to update your account security.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {passwordError && (
                <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-2xl">{passwordError}</div>
              )}
              <Input
                placeholder="Old Password"
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, oldPassword: e.target.value }))}
                disabled={passwordLoading}
                className="rounded-2xl"
              />
              <Input
                placeholder="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                disabled={passwordLoading}
                className="rounded-2xl"
              />
            </div>
            <DialogFooter className="flex flex-row gap-3 justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setChangePasswordOpen(false)}
                disabled={passwordLoading}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button onClick={submitChangePassword} disabled={passwordLoading} className="rounded-full">
                {passwordLoading ? "Saving..." : "Change Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
