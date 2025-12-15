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
  // 1. Conversão segura do preço
  const precoNum = Number(produto.price);
  const precoFormatado = isNaN(precoNum) ? "0.00" : precoNum.toFixed(2);

  // 2. Tratamento do URL da imagem
  const imagemUrl = produto.image.startsWith('http') 
    ? produto.image 
    : `https://deisishop.pythonanywhere.com${produto.image}`;

  return (
    <div className="group bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col h-full w-full">
      
      {/* Área da Imagem */}
      <div className="relative h-64 w-full bg-white p-4">
        <Image
          src={imagemUrl}
          alt={produto.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Área de Informação */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        {/* Título e Categoria */}
        <div>
           <h3 className="text-lg font-bold text-gray-200 truncate group-hover:text-cyan-400 transition-colors" title={produto.title}>
            {produto.title}
          </h3>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800 px-2 py-1 rounded w-fit mt-1 inline-block">
            {produto.category}
          </span>
        </div>
        
        {/* Rodapé do Cartão (Preço + Botões) */}
        <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-col gap-3">
          
          <div className="flex justify-between items-end">
             <span className="text-2xl font-mono text-green-400 font-bold">
              {precoFormatado} €
            </span>
          </div>

          <div className="flex gap-2 w-full">
            {/* Lógica: Botão Remover (Carrinho) vs Botões Loja */}
            {onRemoveFromCart ? (
               <button 
                onClick={() => onRemoveFromCart(produto)}
                className="w-full py-2 bg-red-900/20 text-red-400 border border-red-500/30 rounded hover:bg-red-600 hover:text-white transition-all font-bold text-xs uppercase tracking-wide"
              >
                Remover
              </button>
            ) : (
              <>
                {/* CORREÇÃO AQUI: Link ajustado para /produtos/ID */}
                <Link 
                  href={`/produtos/${produto.id}`}
                  className="flex-1 py-2 text-center bg-zinc-800 text-zinc-300 border border-zinc-700 rounded hover:bg-zinc-700 hover:text-white transition-all font-bold text-xs uppercase tracking-wide flex items-center justify-center"
                >
                  + Info
                </Link>

                <button 
                  onClick={() => onAddToCart && onAddToCart(produto)}
                  className="flex-1 py-2 bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500 hover:text-black transition-all font-bold text-xs uppercase tracking-wide"
                >
                  Adicionar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}