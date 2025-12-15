import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/models/interfaces';

interface ProdutoCardProps {
  produto: Product;
  onAddToCart?: (produto: Product) => void;
  onRemoveFromCart?: (produto: Product) => void;
}

export default function ProdutoCard({ produto, onAddToCart, onRemoveFromCart }: ProdutoCardProps) {
  const precoNum = Number(produto.price);
  const precoFormatado = isNaN(precoNum) ? "0.00" : precoNum.toFixed(2);

  const imagemUrl = produto.image.startsWith('http') 
    ? produto.image 
    : `https://deisishop.pythonanywhere.com${produto.image}`;

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-500 hover:shadow-lg transition-all duration-300 flex flex-col h-full w-full relative">
      
      {/* LINK GLOBAL: Cobre o cartão todo. O utilizador vai para o detalhe ao clicar em qualquer sítio vazio */}
      <Link href={`/deisishop/produtos/${produto.id}`} className="absolute inset-0 z-0" title="Ver Detalhes do Produto" />

      {/* Imagem (pointer-events-none deixa o clique passar para o Link atrás) */}
      <div className="relative h-64 w-full bg-white p-4 z-10 pointer-events-none">
        <Image
          src={imagemUrl}
          alt={produto.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Informação */}
      <div className="p-5 flex flex-col flex-1 gap-2 z-10 pointer-events-none">
        <h3 className="text-lg font-bold text-gray-200 truncate" title={produto.title}>
          {produto.title}
        </h3>
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800 px-2 py-1 rounded w-fit">
          {produto.category}
        </span>
        
        <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-col gap-3">
          <span className="text-2xl font-mono text-green-400 font-bold">
            {precoFormatado} €
          </span>

          {/* Área Interativa (Botões) - pointer-events-auto reativa o clique nestes elementos */}
          <div className="w-full pointer-events-auto z-20">
            {onRemoveFromCart ? (
               <button 
                onClick={(e) => {
                  e.preventDefault(); // Impede a navegação do Link global
                  onRemoveFromCart(produto);
                }}
                className="w-full py-2 bg-red-900/20 text-red-400 border border-red-500/30 rounded hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-wide"
              >
                Remover
              </button>
            ) : (
              <button 
                onClick={(e) => {
                  e.preventDefault(); // Impede a navegação do Link global
                  onAddToCart && onAddToCart(produto);
                }}
                className="w-full py-2 bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500 hover:text-black transition-all font-bold text-xs uppercase tracking-wide"
              >
                Adicionar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}