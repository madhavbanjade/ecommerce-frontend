import { fetchAPI } from "@/src/utils/apiService";

export default async function ProductDetails({params}:any){
    const {slug}   = await params;
      const res = await fetchAPI({ endPoint: `products/${slug}` });
    console.log("slug", slug)
    return(
        <div className="container">
            <h1>Product</h1>
        </div>
    )
}