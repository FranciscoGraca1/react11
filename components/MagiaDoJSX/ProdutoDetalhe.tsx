import React from 'react';
import Image from 'next/image';
import { Product } from '@/models/interfaces';

interface ProdutoDetalheProps {
  produto: Product;
  onBack: () => void;
}

export default function ProdutoDetalhe({ produto, onBack }: ProdutoDetalheProps) {
  // CORREÇÃO: Verifica se a imagem já é um link absoluto antes de adicionar o domínio
  const imagemUrl = produto.image.startsWith('http') 
    ? produto.image 
    : `https://deisishop.pythonanywhere.com${produto.image}`;

  // Garante que o preço é um número válido
  const precoNum = Number(produto.price);
  const precoFormatado = isNaN(precoNum) ? "0.00" : precoNum.toFixed(2);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-2xl max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 text-sm text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-2 uppercase tracking-widest font-bold"
      >
        ← Voltar à Loja
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Coluna Imagem */}
        <div className="relative h-80 md:h-[450px] w-full bg-white rounded-xl p-8 flex items-center justify-center">
          <Image
            src={imagemUrl}
            alt={produto.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Coluna Informação */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-cyan-500 text-xs font-bold uppercase tracking-widest border border-cyan-500/30 px-2 py-1 rounded bg-cyan-950/30">
              {produto.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-4 leading-tight">
              {produto.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center text-yellow-400 gap-1">
              <span>★</span>
              <span className="font-bold">{produto.rating.rate}</span>
            </div>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">{produto.rating.count} avaliações</span>
          </div>

          <p className="text-zinc-300 leading-relaxed text-lg border-l-2 border-zinc-700 pl-4">
            {produto.description}
          </p>

          <div className="mt-auto pt-6 border-t border-zinc-800">
            <p className="text-zinc-500 text-sm uppercase tracking-wide mb-1">Preço Atual</p>
            <span className="text-5xl font-mono text-green-400 font-bold block mb-6">
              {precoFormatado} €
            </span>
            
            <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] transition-all transform hover:-translate-y-1">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}