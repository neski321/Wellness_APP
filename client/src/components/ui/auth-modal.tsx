import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/AuthContext";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login, signUp, loginWithGoogle, signInAsGuest, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email, password);
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  };

  const handleSignup = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      await signUp(email, password, name.trim());
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message || "Signup failed");
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message || "Google login failed");
    }
  };

  const handleGuest = async () => {
    setError(null);
    try {
      await signInAsGuest();
      onOpenChange(false);
    } catch (e: any) {
      setError(e.message || "Guest login failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-full">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === "login" ? "Login to MindPulse" : "Sign Up for MindPulse"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Enter your email and password to log in."
              : "Enter your name, email, and password to create a new account."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {mode === "signup" && (
            <Input
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={loading}
            />
          )}
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading} className="w-full">
            {mode === "login" ? "Login" : "Sign Up"}
          </Button>
          <Button onClick={handleGoogle} variant="outline" disabled={loading} className="w-full">
            Continue with Google
          </Button>
          <Button onClick={handleGuest} variant="secondary" disabled={loading} className="w-full">
            Continue as Guest
          </Button>
          <div className="text-center text-sm text-gray-500">
            {mode === "login" ? (
              <>
                Don't have an account?{' '}
                <button className="underline" onClick={() => setMode("signup")}>Sign Up</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button className="underline" onClick={() => setMode("login")}>Login</button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 