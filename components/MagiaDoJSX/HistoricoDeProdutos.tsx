import React from 'react';
import Image from 'next/image';
import { Product } from '@/models/interfaces';

interface HistoricoProdutosProps {
  historico: Product[];
  onSelectProduct: (produto: Product) => void;
}

export default function HistoricoProdutos({ historico, onSelectProduct }: HistoricoProdutosProps) {
  if (historico.length === 0) return null;

  return (
    <div className="w-full bg-zinc-900 border-y border-zinc-800 p-4 mb-8">
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">
        Visto Recentemente
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-zinc-900">
        {historico.map((produto) => {
           const imgUrl = produto.image.startsWith('http') 
           ? produto.image 
           : `https://deisishop.pythonanywhere.com${produto.image}`;
           
           return (
            <div 
              key={produto.id} 
              onClick={() => onSelectProduct(produto)}
              className="flex-shrink-0 w-32 bg-black border border-zinc-800 rounded-lg p-2 cursor-pointer hover:border-cyan-500 transition-all group"
            >
              <div className="relative w-full h-24 mb-2 bg-white rounded-md p-1">
                <Image 
                  src={imgUrl} 
                  alt={produto.title} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <p className="text-green-400 font-mono text-xs font-bold text-center">
                {Number(produto.price).toFixed(2)} €
              </p>
            </div>
           );
        })}
      </div>
    </div>
  );
}