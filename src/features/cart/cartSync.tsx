"use client"

import { useEffect, useRef } from "react";
import { userCartStore } from "./cartStore";
import { fetchCart } from "./cartService";



interface CartSyncProps{
    isLoggedIn: boolean;
}


export default function CartSync({ isLoggedIn }: CartSyncProps) {
  const syncFromBackend = userCartStore((s) => s.syncFromBackend);
  const hasSynced = useRef(false);
 
  useEffect(() => {
    if (!isLoggedIn || hasSynced.current) return;
 
    hasSynced.current = true;
 
    const sync = async () => {
      const items = await fetchCart();
      syncFromBackend(items);
    };
 
    sync();
  }, [isLoggedIn, syncFromBackend]);
 
  return null;
}