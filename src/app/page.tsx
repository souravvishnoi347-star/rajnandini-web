import React from "react";
import { getAllProducts } from "@/lib/catalogService";
import HomeClientView from "@/components/HomeClientView";

export default async function HomePage() {
  const allProducts = await getAllProducts();

  return <HomeClientView initialProducts={allProducts} />;
}
