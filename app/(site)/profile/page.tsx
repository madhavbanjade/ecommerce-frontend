import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { logout, order, payment, saved, security, user } from "@/src/assets";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

const navaitems = [
  { label: "Profile Details", href: "/profile", icon: user },
  { label: "Order History", href: "/orders", icon: order },
  { label: "Saved Address", href: "/address", icon: saved },
  { label: "Payment Method", href: "/payment", icon: payment },
  { label: "Security & Privacy", href: "/security", icon: security },
];

export default function Profile({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const active = searchParams.tab;
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="container flex items-start gap-1">

        {/* //side tabs */}
        <div className="bg-white w-64 shrink-0 border-zinc-200 rounded-xl p-4 border ">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest px-2 mb-3">
            Account Dashboard
          </p>

          <nav className="flex flex-col gap-1">
            {navaitems.map((item) => {
              const isActive = active === item.label;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={16}
                    height={16}
                    className={`${
                      isActive
                        ? "opacity-100"
                        : "opacity-60 group-hover:opacity-100"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <hr className="my-4 border-zinc-200" />

          <button className="flex items-center gap-3 px-3 py-2.5 w-full text-sm text-black hover:bg-red-50 rounded-lg transition-colors hover:text-red-500 cursor-pointer">
            <Image
              src={logout}
              alt="sign out"
              width={16}
              height={16}
            />{" "}
            Sign out
          </button>
        </div>
        {/* //headings */}
        <div className="
        flex-1 bg-white border border-zinc-200 rounded-xl p-8
        ">
          <h1 className="text-zinc-900 mb-1">Profile Details</h1>
          <p className="text-sm text-zinc-500 mb-6">Manage Your Personal Information</p>

          <div className="flex items-center gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-200 mb-8">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-zinc-200 shrink-0">
              <Image src={user} alt="avater" fill className="object-cover" />
            </div>

            <div className="
            ">
              <p className="font-medium text-zinc-900">Madhav Banjade</p>
              <p className="font-medium text-zinc-900">madhavbanjde005@gmail.com</p>
            </div>

            <button className="ml-auto cursor-pointer text-sm px-4 py-2 border border-zinc-200n rounded-lg text-zinc-600 hover:bg-black hover:text-zinc-100 transition-colors" >
              Change Photo
            </button>


          </div>
        {/* data */}
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">Personal Information</p>
<div className="grid grid-cols-2 gap-4 mb-6">
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-zinc-600">Full name</label>
    <input defaultValue="Alexandre" className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
  </div>
    <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Last name</label>
              <input defaultValue="Martin" className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Email address</label>
              <input type="email" defaultValue="alexandre@email.com" className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Phone number</label>
              <input type="tel" defaultValue="+(977) 9749344926" className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Birthday</label>
              <input type="text" defaultValue="12/14/2003" className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-600">Gender</label>
              <input type="text" defaultValue="Male" className="h-10 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
</div>
<div className="flex justify-end ">
     <Button variant={"outline"} className="bg-black" >Save Changes</Button>
</div>


        </div>
      </div>
    </>
  );
}
