import { logout, order, payment, saved, security, user } from "@/src/assets";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { cookies } from "next/headers";
import { fetchAPI } from "@/src/utils/apiService";

export default async function Profile() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
    const res = await fetchAPI({
      endPoint: "users/me",
      headers:{
        Cookie: cookieHeader
      },
      revalidateSeconds: 0
    })
    console.log("res", res)
      const profile = res.data?.data;
console.log("profile", profile)

  return (
    <>
      <div className="container flex items-start">
        {/* //headings */}
        <div
          className="
        flex-1 bg-white border border-zinc-200 rounded-xl p-8
        "
        >
          <h1 className="text-zinc-900 mb-1">Profile Details</h1>
          <p className="text-sm text-zinc-500 mb-6">
            Manage Your Personal Information
          </p>

{
  !profile ? (
      <p className="text-sm text-zinc-400">Login First...</p>
      ) : ( 

        <div className="">

           <div className="flex items-center gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-200 mb-8">

            {profile ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-zinc-200 shrink-0">
    <Image src={user} alt="avatar" fill className="object-cover" />
  </div>
 
) : (
 <div className="w-16   h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-semibold">
    {profile?.username?.charAt(0)?.toUpperCase()}
  </div>
)}

           

            <div
              className="
            "
            >
              <p className="font-medium text-zinc-900">{profile.username}</p>
              <p className="font-medium text-zinc-900">
               {profile.email} vk
              </p>
            </div>

            <button className="ml-auto cursor-pointer text-sm px-4 py-2 border border-zinc-200n rounded-lg text-zinc-600 hover:bg-black hover:text-zinc-100 transition-colors">
              Change Photo
            </button>
          </div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
            Personal Information
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">
              Full Name
              </label>
              <input
                defaultValue={profile.username || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">
               Last Name
              </label>
              <input
                  defaultValue={profile.username || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">
                Email
              </label>
              <input
                type="email"
               defaultValue={profile.email || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">
                Contact Number
              </label>
              <input
                type="tel"
                  defaultValue={profile.contact || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">
              Date of Birth
              </label>
              <input
                type="text"
               defaultValue={profile.dob || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">
              Gender
              </label>
              <input
                type="text"
                 defaultValue={profile.gender || ""}
                className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex justify-end ">
            <Button variant={"outline"} className="bg-black">
              Save Changes
            </Button>
          </div>

        </div>
       
      )
}
         
        </div>
      </div>
    </>
  );
}
