import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/models/interfaces';

interface ProdutoCardProps {
  produto: Product;
  onAddToCart: (produto: Product) => void;
}

export default function ProdutoCard({ produto, onAddToCart }: ProdutoCardProps) {
  // Conversão segura do preço
  const precoNum = Number(produto.price);
  const precoFormatado = isNaN(precoNum) ? "0.00" : precoNum.toFixed(2);
  const imagemUrl = `https://deisishop.pythonanywhere.com${produto.image}`;

  return (
    <div className="group bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col h-full">
      
      <div className="relative h-64 w-full bg-white p-4">
        <Image
          src={imagemUrl}
          alt={produto.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-lg font-bold text-gray-200 line-clamp-1 group-hover:text-cyan-400 transition-colors" title={produto.title}>
          {produto.title}
        </h3>
        
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800 px-2 py-1 rounded w-fit">
          {produto.category}
        </span>
        
        <div className="mt-auto pt-4 flex justify-between items-center border-t border-zinc-800 gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-mono text-green-400 font-bold">
              {precoFormatado} €
            </span>
          </div>

          <div className="flex gap-2">
            {/* Botão + Info */}
            <Link 
                href={`/produtos/${produto.id}`}
                className="px-3 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded hover:bg-zinc-700 hover:text-white transition-all font-bold text-xs uppercase tracking-wide"
            >
              + Info
            </Link>

            <button 
              onClick={() => onAddToCart(produto)}
              className="px-3 py-2 bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500 hover:text-black transition-all font-bold text-xs uppercase tracking-wide"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}