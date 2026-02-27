
import ProductCard from "@/src/components/ui/product-card"
import { fetchAPI } from "@/src/utils/apiService"


export default async function Products() {

const res = await  fetchAPI({
  endPoint: 'products'
}
)


const products =  res.data?.data ?? null;
const error = res.error ?? null;



  
  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-6 text-dark">


       
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
        </div>
   
  )
}