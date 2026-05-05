import { Skeleton } from "../skeleton"


export default function productCardSkeleton() {
    return (

<div className="border rounded-lg p-4 space-y-3

">

    <Skeleton  className="h-40 w-full rounded-md"/>

    <Skeleton className="h-4 w-3/4"/> 
    <Skeleton className="h-4 w-1/2"/> 
    <Skeleton className="h-6 w-1/3"/> 

</div>

    )
}