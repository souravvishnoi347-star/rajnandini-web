import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/catalogService";
import { generateProductSchema, getProductSlug, SITE_CONFIG } from "@/lib/seoEngine";
import ProductClientView from "./ProductClientView";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: getProductSlug(product),
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Rajnandini Boutique Haridwar",
    };
  }

  const title = `${product.name} | Rajnandini Boutique Haridwar`;
  const description =
    product.description ||
    `Buy ${product.name} crafted in pure ${product.fabric || "silk"} at Rajnandini Boutique Haridwar. 100% genuine ethnic couture, free insured pan-India delivery, and doorstep boutique fitting.`;

  const canonicalUrl = `${SITE_CONFIG.url}/products/${slug}`;
  const imageUrl = product.imageUrl || `${SITE_CONFIG.url}/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1000,
          alt: `${product.name} - Rajnandini Boutique Haridwar`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.sku !== product.sku
  );

  const productJsonLd = generateProductSchema(product);

  return (
    <>
      {/* Product Rich Snippet Schema for Google Shopping & AI Overviews */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductClientView
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
