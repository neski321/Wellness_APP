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
import { CrisisResources } from "@/components/crisis-resources"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

export default function Settings() {
  const { toast } = useToast()
  const { user, loading, logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showCrisisResources, setShowCrisisResources] = useState(false)

  const handleToggle = (setting: string, value: boolean) => {
    console.log(`${setting} toggled to: ${value}`)
    toast({
      title: `${setting} ${value ? 'enabled' : 'disabled'}`,
      description: `Your ${setting.toLowerCase()} setting has been updated.`,
    })
  }

  const handleSignOut = async () => {
    try {
      await logout()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const supportItems = [
    {
      title: "Help Center",
      description: "Find answers to common questions",
      icon: <HelpCircle className="w-5 h-5 text-blue-500" />,
      color: "from-blue-50 to-cyan-50",
      onClick: () => {
        toast({
          title: "Help Center",
          description: "Help center coming soon!",
        })
      },
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: <Mail className="w-5 h-5 text-green-500" />,
      color: "from-green-50 to-emerald-50",
      onClick: () => {
        toast({
          title: "Contact Support",
          description: "Contact support coming soon!",
        })
      },
    },
    {
      title: "Crisis Resources",
      description: "Access emergency mental health support",
      icon: <Phone className="w-5 h-5 text-red-500" />,
      color: "from-red-50 to-pink-50",
      onClick: () => setShowCrisisResources(true),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen">
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
                      onClick={handleSignOut}
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

        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications for mood check-ins and reminders</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={(value) => {
                    setNotifications(value)
                    handleToggle("Push notifications", value)
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Email Updates</h3>
                    <p className="text-sm text-muted-foreground">Get weekly progress reports and wellness tips</p>
                  </div>
                </div>
                <Switch
                  checked={emailUpdates}
                  onCheckedChange={(value) => {
                    setEmailUpdates(value)
                    handleToggle("Email updates", value)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Privacy Mode</h3>
                    <p className="text-sm text-muted-foreground">Hide sensitive content when screen is shared</p>
                  </div>
                </div>
                <Switch
                  checked={privacyMode}
                  onCheckedChange={(value) => {
                    setPrivacyMode(value)
                    handleToggle("Privacy mode", value)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
                  onClick={item.onClick}
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

        {/* Crisis Resources Modal */}
        {showCrisisResources && (
          <CrisisResources onClose={() => setShowCrisisResources(false)} />
        )}
      </motion.div>
    </div>
  )
}
