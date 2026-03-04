import NewArrivals from "../layout/new-arrivals";
import ProductListing from "./productListing";

export default async function NewProducts({ slug }:any) {
  return (
    <>
      <NewArrivals />
      <ProductListing slug={slug} />
    </>
  );
}
