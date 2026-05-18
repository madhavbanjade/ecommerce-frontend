  "use client";
  import { fetchAPI } from "@/src/utils/apiService";
  import { Button } from "./button";
  import Image from "next/image";
  import { useRef, useState } from "react";
  import { toast } from "sonner";

  interface ProfileProps {
    profile: any;
  }

  export default function UpdateProfile({ profile }: ProfileProps) {
      const inputRef = useRef<HTMLInputElement>(null)
        const [loading, setLoading] = useState(false)
      
    const handleUpdate = async (data: FormData | Record<string, any>) => {
      setLoading(true)
      try {
        const res = await fetchAPI({
          endPoint: `users/${profile.id}`,
          method: "PATCH",
          data,
        })
        if (res.success) {
          toast.success("Profile updated!")
          window.location.reload()
        } else {
          toast.error(res.error || "Failed to update")
        }
      } catch {
        toast.error("Something went wrong")
      } finally {
        setLoading(false)

      }
    }

    const handlePhotoChange =   async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if(!file) return
        console.log("File selected:", file.name, file.type, file.size)
      const formData = new FormData()
      formData.append("image", file)
        console.log("FormData image:", formData.get("image"))
      await handleUpdate(formData)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      await handleUpdate({
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        contact: formData.get("contact"),
        dob: formData.get("dob"),
        gender: formData.get("gender"),
      })
    }

    return (
      <>
        {!profile ? (
          <p className="text-sm text-zinc-400">Login First...</p>
        ) : (
          <div className="">
           <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-zinc-50 rounded-xl border border-zinc-200 mb-8">

  {/* Avatar */}
  {profile?.image ? (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-zinc-900 shrink-0 mx-auto sm:mx-0">
      <Image
        src={profile.image}
        alt="avatar"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  ) : (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-semibold shrink-0 mx-auto sm:mx-0">
      {profile?.username?.charAt(0)?.toUpperCase()}
    </div>
  )}

  {/* User Info */}
  <div className="text-center sm:text-left">
    <h2 className="font-large text-zinc-900 break-all">
      {profile.username}
    </h2>
  </div>

  {/* Hidden Input */}
  <input
    ref={inputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handlePhotoChange}
  />

  {/* Button */}
  <button
    type="button"
    onClick={() => inputRef.current?.click()}
    disabled={loading}
    className="
      w-full sm:w-auto
      sm:ml-auto
      cursor-pointer text-sm p-2
      border border-zinc-200 rounded-lg
      text-zinc-600
      hover:bg-black hover:text-white
      transition-colors
    "
  >
    Change Photo
  </button>
</div>

{/* //body */}

          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
  Personal Information
</p>

<form
  onSubmit={handleSubmit}
  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
>
  {/* Full Name */}
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-zinc-600">Full Name</label>
    <input
      name="fullname"
      defaultValue={profile.fullname || ""}
      className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>

  {/* Email */}
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-zinc-600">Email</label>
    <input
      name="email"
      type="email"
      defaultValue={profile.email || ""}
      className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>

  {/* Contact */}
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-zinc-600">
      Contact Number
    </label>
    <input
      name="contact"
      type="tel"
      defaultValue={profile.contact || ""}
      className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>

  {/* DOB */}
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-zinc-600">
      Date of Birth
    </label>
    <input
      name="dob"
      type="date"
      defaultValue={profile.dob ? profile.dob.split("T")[0] : ""}
      className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>

  {/* Gender */}
  <div className="flex flex-col gap-1.5 sm:col-span-2 md:col-span-1">
    <label className="text-sm font-medium text-zinc-600">Gender</label>
    <select
      name="gender"
      defaultValue={profile.gender || ""}
      className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* Button */}
  <div className="sm:col-span-2 flex justify-stretch sm:justify-end">
    <Button
      type="submit"
      variant={"outline"}
      className="w-full sm:w-auto bg-black text-white"
    >
      Save Changes
    </Button>
  </div>
</form>
          </div>
        )}
      </>
    );
  }