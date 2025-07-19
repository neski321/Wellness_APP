import { Switch, Route } from "wouter"
import { queryClient } from "./lib/queryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BottomNav } from "@/components/bottom-nav"
import { BackgroundAnimation } from "@/components/background-animation"
import SplashCursor from "@/components/splash-cursor"
import Home from "@/pages/home"
import Progress from "@/pages/progress"
import Resources from "@/pages/resources"
import Community from "@/pages/community"
import Settings from "@/pages/settings"
import NotFound from "@/pages/not-found"
import { useState } from "react"
import { Button } from "@/components/ui/button"

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/progress" component={Progress} />
      <Route path="/resources" component={Resources} />
      <Route path="/community" component={Community} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 relative">
          {/* Background Animation */}
          <BackgroundAnimation />

          {/* Splash Cursor Effect */}
          <SplashCursor />

          {/* Main Content */}
          <div className="relative z-10">
            <header className="w-full flex justify-end p-2">
              <Button onClick={() => setAuthOpen(true)} variant="outline">
                Login / Sign Up / Guest
              </Button>
            </header>
            <Router />
            <BottomNav />
          </div>

          <Toaster />
          {/* Temporarily disabled AuthModal for testing */}
          {/* <AuthModal open={authOpen} onOpenChange={setAuthOpen} /> */}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
