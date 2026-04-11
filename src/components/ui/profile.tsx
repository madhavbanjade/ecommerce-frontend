"use client";
import { fetchAPI } from "@/src/utils/apiService";
import { Button } from "./button";
import Image from "next/image";
import { useRef, useState } from "react";

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
       console.log("ressss", res) 
      alert("Profile Update")
      if (res.success) window.location.reload()
      else alert(res.error || "Failed to update")
    } catch {
      alert("Something went wrong")
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
          <div className="flex items-center gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-200 mb-8">
            {profile?.image ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-zinc-300 shrink-0">
                <Image
                  src={profile.image}
                  alt="avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-semibold">
                {profile?.username?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div>
              <p className="font-medium text-zinc-900">{profile.username}</p>
              <p className="font-medium text-zinc-900">{profile.email}</p>
            </div>

             {/* Change Photo */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

            <button 
            type="button"
            onClick={() => inputRef.current?.click()}
          disabled={loading}
            
            className="ml-auto cursor-pointer text-sm px-4 py-2 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-black hover:text-zinc-100 transition-colors">
              Change Photo
            </button>
          </div>

          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
            Personal Information
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Full Name</label>
              <input
                name="fullname"                           // ✅ added name
                defaultValue={profile.fullname || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Email</label>
              <input
                name="email"                              // ✅ added name
                type="email"
                defaultValue={profile.email || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Contact Number</label>
              <input
                name="contact"                            // ✅ added name
                type="tel"
                defaultValue={profile.contact || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Date of Birth</label>
              <input
                name="dob"                                // ✅ added name
                type="date"                               // ✅ better input type
               defaultValue={profile.dob ? profile.dob.split("T")[0] : ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Gender</label>
              <select                                      // ✅ select is better UX than free text
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

            <div className="flex justify-end">
              <Button type="submit" variant={"outline"} className="bg-black">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}