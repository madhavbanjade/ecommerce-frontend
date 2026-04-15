import Image from "next/image";
import { cookies } from "next/headers";
import { fetchAPI } from "@/src/utils/apiService";
import UpdateProfile from "@/src/components/ui/profile";

export default async function Profile() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetchAPI({
    endPoint: "users/me",
    headers: { Cookie: cookieHeader },
    revalidateSeconds: 0,
  });

  const profile = res.data?.data;

  return (
    <div className="w-full">
      <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-base sm:text-lg lg:text-xl font-medium text-zinc-900 mb-1">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mb-6">
          Manage your personal information
        </p>
      </div>
    </div>
  );
}