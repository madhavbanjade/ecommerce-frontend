import ProfileSidebar from "@/src/components/ui/profileSidebar";

export default async function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="container mt-24">
      <div className="flex gap-3">
          <ProfileSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}