import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, getAuthErrorMessage } from "@/hooks/useAuth";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAsync, isLoggingIn, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginAsync(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch {
      toast.error(getAuthErrorMessage(loginError) || "Login failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='w-full max-w-md'>
      {/* Card */}
      <div className='bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4'>
            {/* <span className='text-2xl'>🕌</span> */}
          </div>
          <h1 className='text-2xl font-bold font-heading'>Welcome Back</h1>
          <p className='text-muted-foreground mt-2'>
            Sign in to manage your mosque broadcasts
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {/* Email */}
          <div className='space-y-2'>
            <label htmlFor='email' className='text-sm font-medium'>
              Email
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <input
                id='email'
                type='email'
                placeholder='mosque@example.com'
                className='w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <label htmlFor='password' className='text-sm font-medium'>
              Password
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='••••••••'
                className='w-full h-11 pl-10 pr-12 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'
                {...register("password")}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'>
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='text-sm text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type='submit'
            disabled={isLoggingIn}
            className='w-full h-11 bg-primary hover:from-emerald-600 hover:to-teal-700 text-white font-medium'>
            {isLoggingIn ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className='mt-6 text-center text-sm text-muted-foreground'>
          Don't have an account?{" "}
          <Link
            to='/register'
            className='text-emerald-500 hover:text-emerald-400 font-medium transition-colors'>
            Register your mosque
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
