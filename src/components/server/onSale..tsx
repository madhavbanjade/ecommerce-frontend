import OnSale from "../layout/on-sale";
import ProductListing from "./productListing";

export default async function SaleProducts({ slug }:any) {
  return (
    <>
      <OnSale />
      <ProductListing slug={slug} />
    </>
  );
}
