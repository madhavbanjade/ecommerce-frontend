import ProfileSidebar from "@/src/components/ui/profileSidebar";
import { fetchAPI } from "@/src/utils/apiService";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join(";");

  const res = await fetchAPI({
    endPoint: "users/me",
    headers:{
        Cookie: cookieHeader
    },
    revalidateSeconds: 0,
  });
  const user = res?.data?.data ?? null;
  if (!user) redirect("/auth");

  return (
    <div className="container mt-24 flex gap-6 h-[calc(100vh-6rem)]">
      <div className="shrink-0 sticky top-24 self-start">
        <ProfileSidebar user={user} />
      </div>
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
