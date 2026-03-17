import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider, isFirebaseConfigured } from "../firebase"
import { useToastHelpers } from "@/components/ui/saas-toast";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome, Mail, Lock, User } from "lucide-react";
import { API } from '@/utils/api';

export function Signup() {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToastHelpers();
  const { login } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords do not match", "Please make sure both passwords are the same");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API.AUTH.REGISTER, {
        method: "POST",
        headers: API.getHeaders(),
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        showError("Signup failed", data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", String(data.user.role === 'admin'));

      showSuccess("Account created", "Welcome to TeamBrother's!");
      
      // Force full page reload to update AppContext
      window.location.href = data.user.role === 'admin' ? '/admin' : '/home';

    } catch (err) {
      showError("Server error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!isFirebaseConfigured) {
      showError('Google Login Not Available', 'Firebase is not configured. Please set up your Firebase credentials.');
      return;
    }

    if (!auth || !googleProvider) {
      showError('Google Login Not Available', 'Firebase authentication is not properly initialized.');
      return;
    }

    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch(API.AUTH.GOOGLE, {
        method: "POST",
        headers: API.getHeaders(),
        body: JSON.stringify({
          idToken,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        })
      });

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", String(data.user.role === 'admin'));

      showSuccess('Google signup successful', `Welcome ${data.user.name}!`);
      
      // Force a full page reload to ensure AppContext picks up the new state
      window.location.href = data.user.role === 'admin' ? '/admin' : '/home';

    } catch (err) {
      showError("Google signup failed", "Something went wrong with Google signup");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden md:flex bg-gradient-to-br from-emerald-600 to-teal-500 items-center justify-center text-white">
        <div className="max-w-md text-center px-6">
          <h1 className="text-4xl font-bold mb-4">TeamBrother's</h1>
          <p className="text-lg opacity-90">
            Create your account and start your journey with smart vehicle rentals
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="text-muted-foreground mt-1">
              Join us to plan your perfect road trip
            </p>
          </div>

          {/* GOOGLE SIGNUP */}
          <Button
            variant="outline"
            className="w-full flex gap-2"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
          >
            <Chrome size={18} />
            {googleLoading ? "Signing up with Google..." : "Continue with Google"}
          </Button>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex-1 border-t" />
            OR
            <div className="flex-1 border-t" />
          </div>

          {/* SIGNUP FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
