import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../firebase";
import { useToastHelpers } from "@/components/ui/saas-toast";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome } from "lucide-react";
import { API } from '@/utils/api';

export function Login() {

  const navigate = useNavigate();

  const { success: showSuccess, error: showError } = useToastHelpers();

  const { login } = useApp();



  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);



    try {

      const success = await login(email, password);



      if (success) {

        showSuccess("Login successful", "Welcome back!");

        // Force full page reload to update AppContext

        window.location.href = '/home';

      } else {

        throw new Error("Invalid credentials");

      }

    } catch (error: any) {

      showError("Login failed", error.message);

    } finally {

      setLoading(false);

    }

  };



  const handleGoogleLogin = async () => {

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



      const response = await fetch(API.AUTH.GOOGLE, {

        method: "POST",

        headers: API.getHeaders(),

        body: JSON.stringify({ 

          idToken,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }),

      });



      const data = await response.json();



      if (data.success) {

        // Store in localStorage

        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        localStorage.setItem("isAuthenticated", "true");

        localStorage.setItem("isAdmin", String(data.user.role === 'admin'));



        showSuccess('Google Login Successful', `Welcome ${data.user.name}!`);

        

        // Force a full page reload to ensure AppContext picks up the new state

        window.location.href = data.user.role === 'admin' ? '/admin' : '/home';

      } else {

        throw new Error(data.message || 'Google login failed');

      }

    } catch (error: unknown) {

      console.error('Google login error:', error);

      let errorMessage = 'Google login failed';

      

      if (error instanceof Error) {

        if (error.message.includes('popup-closed-by-user')) {

          errorMessage = 'Login cancelled. Please try again.';

        } else if (error.message.includes('network-request-failed')) {

          errorMessage = 'Network error. Please check your connection.';

        } else {

          errorMessage = error.message;

        }

      }

      

      showError('Google Login Failed', errorMessage);

    } finally {

      setGoogleLoading(false);

    }

  };



  return (

    <div className="min-h-screen grid md:grid-cols-2">



      {/* LEFT SIDE IMAGE */}

      <div className="hidden md:flex bg-gradient-to-br from-emerald-600 to-teal-500 items-center justify-center text-white">

        <div className="max-w-md text-center px-6">

          <h1 className="text-4xl font-bold mb-4">TeamBrother's</h1>

          <p className="text-lg opacity-90">

            Plan your perfect road trip with smart vehicle rentals and route

            recommendations.

          </p>

        </div>

      </div>



      {/* RIGHT SIDE FORM */}

      <div className="flex items-center justify-center p-6 bg-background">

        <div className="w-full max-w-md space-y-6">



          <div className="text-center">

            <h2 className="text-3xl font-bold">Welcome back</h2>

            <p className="text-muted-foreground mt-1">

              Sign in to continue your journey

            </p>

          </div>



          {/* GOOGLE LOGIN */}

          <Button

            variant="outline"

            className="w-full flex gap-2"

            onClick={handleGoogleLogin}

            disabled={googleLoading}

          >

            <Chrome size={18} />

            {googleLoading

              ? "Signing in with Google..."

              : "Continue with Google"}

          </Button>



          <div className="flex items-center gap-3 text-sm text-muted-foreground">

            <div className="flex-1 border-t" />

            OR

            <div className="flex-1 border-t" />

          </div>



          {/* EMAIL LOGIN */}

          <form onSubmit={handleSubmit} className="space-y-4">



            <div>

              <Label>Email</Label>

              <Input

                type="email"

                placeholder="name@example.com"

                value={email}

                onChange={(e) => setEmail(e.target.value)}

              />

            </div>



            <div>

              <Label>Password</Label>

              <Input

                type="password"

                value={password}

                onChange={(e) => setPassword(e.target.value)}

              />

            </div>



            <Button className="w-full" disabled={loading}>

              {loading ? "Signing in..." : "Sign In"}

            </Button>

          </form>



          <p className="text-center text-sm text-muted-foreground">

            Don't have an account?{" "}

            <Link to="/signup" className="text-primary font-medium">

              Sign up

            </Link>

          </p>



        </div>

      </div>

    </div>

  );

}