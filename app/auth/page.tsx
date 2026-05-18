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
import { toast } from "sonner";

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
    fullname?: string;
    contact?: string;
    dob?: any

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
    const fullname = formData.get("fullname") as string;
    const gender = formData.get("gender") as string;
    const contact = formData.get("contact") as string;
    const dob = formData.get("dob") as string;

    const newErrors: typeof fieldErrors = {};

if (!username) newErrors.username = "Username is required";
if (!password) newErrors.password = "Password is required";

if (isRegister) {
  if (!email) newErrors.email = "Email is required";
  if (!fullname) newErrors.fullname = "Fullname is required";
  if (!gender) newErrors.gender = "Gender is required";
  if (!contact) newErrors.contact = "Contact is required";
  if (!dob) newErrors.dob = "DOB is required";
}

    if (Object.keys(newErrors).length) {
      setFieldErrors(newErrors);
      setLoading(false);
      return;
    }

    const endPoint = isRegister ? "users/register" : "users/login";
    const payload = isRegister
      ?  { username, email, password, fullname, gender, contact, dob }
      : { username, password };
    const res = await fetchAPI({
      endPoint,
      method: "POST",
      data: payload,
      setError,
    });
    console.log("user", res)
    if (res.success) {
      if (isRegister) {
        toast.success("Account created! Please log in.")
        router.replace("?auth=login");
      } else {
        toast.success("Welcome back!")
        router.push("/");
      }
    } else {
      toast.error(res.error ?? "Something went wrong")
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
  {/* Full Name */}
  {/* <div>
    <label className="text-dark text-sm font-medium">Full Name</label>
    <Input
      name="fullname"
      type="text"
      placeholder="John Doe"
      className="w-full px-4 py-3 rounded-xl border mt-1"
    />
    {fieldErrors.fullname && (
      <p className="text-red-500 text-sm mt-1">{fieldErrors.fullname}</p>
    )}
  </div> */}

  {/* Email */}
  <div>
    <label className="text-dark text-sm font-medium">Email</label>
    <Input
      name="email"
      type="email"
      placeholder="example@gmail.com"
      className="w-full px-4 py-3 rounded-xl border mt-1"
    />
    {fieldErrors.email && (
      <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
    )}
  </div>

  {/* Contact */}
  {/* <div>
    <label className="text-dark text-sm font-medium">Contact Number</label>
    <Input
      name="contact"
      type="text"
      placeholder="9749344926"
      className="w-full px-4 py-3 rounded-xl border mt-1"
    />
    {fieldErrors.contact && (
      <p className="text-red-500 text-sm mt-1">{fieldErrors.contact}</p>
    )}
  </div> */}

  {/* Gender */}
  {/* <div>
    <label className="text-dark text-sm font-medium">Gender</label>
    <select
      name="gender"
      className="w-full px-4 py-3 rounded-xl border mt-1 text-sm bg-white"
    >
      <option value="">Select gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
    {fieldErrors.gender && (
      <p className="text-red-500 text-sm mt-1">{fieldErrors.gender}</p>
    )}
  </div> */}

  {/* Date of Birth */}
  {/* <div>
    <label className="text-dark text-sm font-medium">Date of Birth</label>
    <Input
      name="dob"       
      type="date"
      className="w-full px-4 py-3 rounded-xl border mt-1"
    />
    {fieldErrors.dob && (
      <p className="text-red-500 text-sm mt-1">{fieldErrors.dob}</p>
    )}
  </div> */}
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
