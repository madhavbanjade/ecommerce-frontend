"use client";

import FormContainer from "@/src/components/ui/FormContainer";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { google } from "@/src/assets";
import Image from "next/image";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "./AuthLayout";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("auth");
  const isRegister = mode !== "login"; // default = register

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError(null);
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const newErrors: typeof fieldErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (isRegister && !email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setLoading(false);
      return;
    }

    console.log(isRegister ? "Registering..." : "Logging in...");
    setLoading(false);
  }

  return (
    <AuthLayout leftText="From Coffee Runs to Night Outs. We've Got You.">
      <FormContainer>
        {/* Tabs */}
        <div className="relative flex gap-4 w-full mb-6">
          {/* Sliding Background */}
          <motion.div
            layout
            className="absolute top-0 h-11 w-1/2 rounded-2xl bg-gradient-to-r from-black via-gray-800 to-black"
            animate={{ x: isRegister ? "0%" : "100%" }}
            transition={{ duration: 0.3 }}
          />

          <Button
            type="button"
            onClick={() => router.push("?auth=register")}
            className={`relative flex-1 h-11 rounded-2xl transition-all duration-300 ${
              isRegister
                ? "text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            Register
          </Button>

          <Button
            type="button"
            onClick={() => router.push("?auth=login")}
            className={`relative flex-1 h-11 rounded-2xl transition-all duration-300 ${
              !isRegister
                ? "text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          >
            Login
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Animated Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={isRegister ? "register" : "login"}
            onSubmit={handleAuth}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Username */}
            <div>
              <label className="text-primary text-sm">Username</label>
              <Input
                name="username"
                placeholder="eg: John Doe"
                className="w-full px-4 py-3 rounded-xl border"
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Email (Only Register) */}
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="text-primary text-sm">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border"
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label className="text-primary text-sm">Password</label>
              <Input
                name="password"
                type="password"
                placeholder="**********"
                className="w-full px-4 py-3 rounded-xl border"
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-black to-gray-700 text-white"
              disabled={loading}
            >
              {loading
                ? isRegister
                  ? "Creating Account..."
                  : "Logging in..."
                : isRegister
                ? "Create Account"
                : "Login"}
            </Button>

            {/* Switch Text */}
            <p className="text-center text-sm text-primary">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <span
                onClick={() =>
                  router.push(
                    isRegister ? "?auth=login" : "?auth=register"
                  )
                }
                className="text-gray-700 font-medium hover:underline cursor-pointer"
              >
                {isRegister ? "Login" : "Register"}
              </span>
            </p>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px opacity-40 bg-primary" />
              <span className="px-3 text-xs">OR</span>
              <div className="flex-1 h-px opacity-40 bg-primary" />
            </div>

            {/* Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 bg-gradient-to-r from-black to-gray-700 text-white"
            >
              <Image src={google} alt="Google" width={20} height={20} />
              Continue with Google
            </Button>
          </motion.form>
        </AnimatePresence>
      </FormContainer>
    </AuthLayout>
  );
}
