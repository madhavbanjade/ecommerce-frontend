import Link from "next/link";

export default function Profile(){
    return(
        <div className="container">
            <h1>Profile</h1>
            <Link href="/wishlist">
            <p>My Wishlits</p>
            </Link>
        </div>
    )
}