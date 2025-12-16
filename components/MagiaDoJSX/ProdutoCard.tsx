import React from 'react';
import Image from 'next/image';
import { Product } from '@/models/interfaces';

interface ProductCardProps {
  produto: Product;
  isFavorite: boolean;                 // <--- NOVA PROP
  onToggleFavorite: (id: number) => void; // <--- NOVA PROP
  onAddToCart?: (produto: Product) => void;
  onRemoveFromCart?: () => void;
}

export default function ProductCard({ 
  produto, 
  isFavorite,
  onToggleFavorite,
  onAddToCart, 
  onRemoveFromCart 
}: ProductCardProps) {
  
  const imageUrl = produto.image.startsWith('http') 
    ? produto.image 
    : `https://deisishop.pythonanywhere.com${produto.image}`;

  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-500 transition-all group h-full flex flex-col shadow-lg relative">
      
      {/* coração */}
      {!onRemoveFromCart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(produto.id);
          }}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black transition-colors"
        >
          {isFavorite ? (
            <h3> ❤️ </h3>
          ) : (
            <h3>🤍</h3>
          )}
        </button>
      )}

      {/* Imagem */}
      <div className="relative h-48 w-full bg-white p-4">
        <Image
          src={imageUrl}
          alt={produto.title}
          fill
          className="object-contain group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white mb-1 line-clamp-1" title={produto.title}>
          {produto.title}
        </h3>
        <p className="text-zinc-400 text-xs mb-4 uppercase tracking-wider font-bold border-b border-zinc-800 pb-2">
          {produto.category}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-2 gap-2">
          <span className="text-xl font-mono text-green-400 font-bold">
            {Number(produto.price).toFixed(2)} €
          </span>
          
          {onRemoveFromCart ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromCart();
              }}
              className="cursor-pointer bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg font-bold text-xs transition-colors shadow-lg"
            >
              Remover
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart && onAddToCart(produto);
              }}
              className="cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg font-bold text-sm transition-colors shadow-lg"
            >
              + Adicionar
            </button>
          )}

        </div>
      </div>
    </article>
  );
}