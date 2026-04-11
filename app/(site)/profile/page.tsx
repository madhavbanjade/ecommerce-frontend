import Image from "next/image";
import { cookies } from "next/headers";
import { fetchAPI } from "@/src/utils/apiService";
import UpdateProfile from "@/src/components/ui/profile";

export default async function Profile() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetchAPI({
    endPoint: "users/me",
    headers: {
      Cookie: cookieHeader,
    },
    revalidateSeconds: 0,
  });

  const profile = res.data?.data;

  return (
    <div className="w-full">
      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 md:p-8">
        {/* Heading */}
        <h1 className="text-lg sm:text-xl text-zinc-900 mb-1">Profile Details</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Manage Your Personal Information
        </p>

        <UpdateProfile profile={profile} />
      </div>
    </div>
  );
}