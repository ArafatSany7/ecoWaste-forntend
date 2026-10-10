"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import GoogleLogin from "@/components/modules/google-login/GoogleLogin";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);

      // Handle demo logins without hitting the API
      if (data.email === "admin@example.com") {
        login({ accessToken: "mock-token", user: { id: "1", email: data.email, role: "ADMIN", name: "Demo Admin" } });
        toast.success("Demo Admin login successful!");
        router.push("/dashboard");
        return;
      }
      if (data.email === "citizen@example.com") {
        login({ accessToken: "mock-token", user: { id: "2", email: data.email, role: "CITIZEN", name: "Demo Citizen" } });
        toast.success("Demo Citizen login successful!");
        router.push("/dashboard");
        return;
      }
      if (data.email === "collector@example.com") {
        login({ accessToken: "mock-token", user: { id: "3", email: data.email, role: "COLLECTOR", name: "Demo Collector" } });
        toast.success("Demo Collector login successful!");
        router.push("/dashboard");
        return;
      }

      const res = await authApi.login(data);
      if (res.success) {
        toast.success(res.message || "Login successful!");
        login(res.data);
        router.push("/dashboard"); // Later routing logic might adapt to user role
      }
    } catch (error) {
      const err = error as { message?: string, errors?: Array<{message: string}> };
      const apiErrors = err.errors?.map(e => e.message).join(", ");
      toast.error(apiErrors || err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card border rounded-3xl shadow-soft dark:shadow-soft-dark mx-auto my-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to access your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="jane@example.com" 
            {...register("email")} 
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            {...register("password")} 
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleLogin />

      <div className="relative pt-4">
        <div className="absolute inset-0 flex items-center pt-4">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase pt-4">
          <span className="bg-card px-2 text-muted-foreground font-semibold">
            One-Click Demo Login
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          type="button" 
          className="text-xs"
          onClick={() => onSubmit({ email: "admin@example.com", password: "password123" })}
          disabled={isLoading}
        >
          Admin
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="text-xs"
          onClick={() => onSubmit({ email: "citizen@example.com", password: "password123" })}
          disabled={isLoading}
        >
          Citizen
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="text-xs"
          onClick={() => onSubmit({ email: "collector@example.com", password: "password123" })}
          disabled={isLoading}
        >
          Collector
        </Button>
      </div>
      
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline hover:text-primary transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
}
