"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/models/interfaces";

export default function CategoriaProdutosPage() {
  const { categoria } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoria) return;
    // URL pode precisar de decode se tiver espaços (%20)
    const catName = decodeURIComponent(categoria as string);
    
    fetch(`https://deisishop.ipvc.pt/api/products?category=${catName}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      });
  }, [categoria]);

  if (isLoading) return <div className="text-purple-500 animate-pulse">A filtrar dados...</div>;

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-zinc-500 hover:text-white">←</button>
        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
          Categoria: <span className="text-purple-400">{decodeURIComponent(categoria as string)}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link 
            href={`/deisishop/produtos/${product.id}`} 
            key={product.id}
            className="group bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-40 w-full bg-white p-4">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-md font-bold text-gray-200 line-clamp-1 group-hover:text-purple-400 transition-colors">
                {product.title}
              </h3>
              <span className="text-lg font-mono text-green-400 font-bold mt-2">
                {product.price.toFixed(2)} €
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}