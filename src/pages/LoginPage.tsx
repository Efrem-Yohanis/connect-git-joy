import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { username, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Half - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  Username / Email
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  required
                  className="rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="rounded-md"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full rounded-md"
                size="lg"
              >
                Login
              </Button>
              
              <div className="text-center">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Right Half - Brand Section */}
      <div className="flex-1 bg-success flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-success-foreground mb-4">
            Safaricom ET Pipeline
          </h1>
          <p className="text-xl text-success-foreground/90">
            Enterprise Telecommunications Pipeline System
          </p>
        </div>
      </div>
    </div>
  );
}