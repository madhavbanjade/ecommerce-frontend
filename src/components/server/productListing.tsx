import ProductCard from "../ui/product-card"
import { fetchAPI } from "@/src/utils/apiService"


interface Props{
    slug: String[]
}



export default async function ProductListing({slug}: Props){
const firstSlug = slug[0];
 let endpoint = "products";

   if (firstSlug === "new-arrivals") {
    endpoint = "products?tag=new"
  }
   if (firstSlug === "on-sale") {
    endpoint = "products?tag=on-sale"
  }


 const res = await fetchAPI({endPoint: endpoint});

const products = res.data?.data ?? null
const error = res.error ?? null

console.log("Products", products)
   

    return(
         <div className="container">
  {error && (
    <p className="text-sale font-medium">{error}</p>
  )}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products && products.map((product:any) => (
        <ProductCard key={product.id} product={product} />  
      ))}
    </div>
    
  </div>
    )
}





// const products =  res.data?.data ?? null;
// const error = res.error ?? null;