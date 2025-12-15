"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Para ler o ID do URL
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/models/interfaces';
import { Button } from "@/components/ui/button";

export default function ProdutoDetalhePage() {
  const params = useParams();
  const id = params.id; // Este é o ID que vem do URL (ex: 5)
  
  const [produto, setProduto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar todos os produtos e encontrar o que tem o ID correto
    fetch('https://deisishop.pythonanywhere.com/products')
      .then((res) => res.json())
      .then((data: Product[]) => {
        const encontrado = data.find((p) => p.id === Number(id));
        setProduto(encontrado || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    alert(`Adicionado ao carrinho: ${produto?.title}`);
  };

  if (loading) return <div className="p-10 text-center text-white">A carregar detalhes...</div>;
  if (!produto) return <div className="p-10 text-center text-red-500">Produto não encontrado.</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
       <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full gap-8">
          
          {/* Lado Esquerdo: Imagem */}
          <div className="w-full md:w-1/2 relative h-96 bg-gray-100 rounded-lg flex items-center justify-center p-4">
             <Image 
                // Link absoluto com o domínio da API
                src={`https://deisishop.pythonanywhere.com${produto.image}`} 
                alt={produto.title} 
                fill 
                className="object-contain hover:scale-110 transition-transform duration-500"
             />
          </div>

          {/* Lado Direito: Informações */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
             <div>
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                    {produto.category}
                </span>
                <h1 className="text-3xl font-bold mb-4 mt-2 text-gray-900">
                    {produto.title}
                </h1>
                
                {/* Detalhes que só aparecem nesta página */}
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {produto.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded w-fit">
                    <span className="text-yellow-500 text-xl">★</span>
                    <span className="font-bold text-gray-800 text-lg">{produto.rating.rate}</span>
                    <span className="text-gray-400 text-sm">({produto.rating.count} avaliações)</span>
                </div>
             </div>

             <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-gray-100">
                <span className="text-4xl font-bold text-green-600 mb-2">
                    {Number(produto.price).toFixed(2)} €
                </span>
                
                <Button onClick={addToCart} size="lg" className="w-full text-lg shadow-lg">
                    Adicionar ao Carrinho
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                    <Link href="/produtos">Voltar à Loja</Link>
                </Button>
             </div>
          </div>
       </div>
    </div>
  );
}