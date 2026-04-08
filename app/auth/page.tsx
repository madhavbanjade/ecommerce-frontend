"use client";
import FormContainer from "@/src/components/ui/FormContainer";
import { useEffect, useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { google } from "@/src/assets";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "./AuthLayout";
import { fetchAPI } from "@/src/utils/apiService";

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
    gender?: string;

  }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    const endPoint = isRegister ? "users/register" : "users/login";
    const payload = isRegister
      ? { username, email, password }
      : { username, password };
    const res = await fetchAPI({
      endPoint,
      method: "POST",
      data: payload,
      setError,
    });
    console.log("user", res)
    if (res.success) {
      //after register switch to login
      if (isRegister) {
        router.replace("?auth=login");
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  }
const handleGoogle = () => {
  window.location.href =
    "http://localhost:3333/api/v1/auth/google/login";
};

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.push("/");
    }
  }, []);



  return (
    <AuthLayout leftText="From Coffee Runs to Night Outs. We've Got You.">
      <FormContainer>
 
 <div className="relative flex w-full mb-6 p-1 bg-gray-100 rounded-2xl overflow-hidden gap-2">

  {/* Sliding Background */}
{/* Sliding Background */}
<motion.div layout className="absolute top-0 h-11 w-1/2 rounded-2xl bg-gradient-to-r from-black via-gray-200 to-black" animate={{ x: isRegister ? "0%" : "100%" }} transition={{ duration: 0.3 }} />

<button
  type="button"
  onClick={() => router.push("?auth=register")}
  className={`relative z-10 w-1/2 h-11 rounded-xl text-sm font-medium transition-colors duration-200 
    ${isRegister ? "text-gray-900" : "text-gray-400"}
  `}
>
  Register
</button>

<button
  type="button"
  onClick={() => router.push("?auth=login")}
  className={`relative z-10 w-1/2 h-11 rounded-xl text-sm font-medium transition-colors duration-200 
    ${!isRegister ? "text-gray-900" : "text-gray-400"}
  `}
>
  Login
</button>
</div>


        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Animated Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={isRegister ? "register" : "login"}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Username */}
            <div>
              <label className="text-dark text-sm">Username</label>
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
                className="space-y-4"
              >
                {/* //fullname */}
                 <label className="text-dark text-sm">Full Name</label>
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



                {/* email */}
                <label className="text-dark text-sm">Email</label>
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

                

                {/* //contact */}
                 <label className="text-dark text-sm">Contact Number</label>
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
                {/* //gender */}
                <label className="text-dark text-sm font-medium">Gender</label>
      <select
        name="gender"
        className="w-full px-4 py-3 rounded-xl border mt-1 text-sm bg-white"
      >
        <option value="">Select gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="prefer_not">Prefer not to say</option>
      </select>
      {fieldErrors.gender && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors.gender}</p>
      )}
                {/* //gender */}
                 <label className="text-dark text-sm">Date of Birth</label>
                <Input
                  name="Dob"
                  type="date"
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
              <label className="text-dark text-sm">Password</label>
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
              variant={"outline"}
              className="w-full h-11"
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
            <p className="text-center text-sm text-dark">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <span
                onClick={() =>
                  router.push(isRegister ? "?auth=login" : "?auth=register")
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
            onClick={handleGoogle}
              type="button"
              variant="outline"
              className="w-full h-11 btn-primary"
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
