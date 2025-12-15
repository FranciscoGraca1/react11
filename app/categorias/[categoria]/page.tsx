"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/models/interfaces';
import ProdutoCard from '@/components/MagiaDoJSX/ProdutoCard';

export default function CategoriaProdutosPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const categoria = decodeURIComponent(String(params.categoria));

  useEffect(() => {
    if (categoria) {
      fetch('https://deisishop.pythonanywhere.com/products')
        .then(res => res.json())
        .then((data: Product[]) => {
          const filtrados = data.filter(p => p.category === categoria);
          setProducts(filtrados);
        });
    }
  }, [categoria]);

  const addToCart = (produto: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(produto);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produto adicionado ao carrinho!');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto text-gray-200">
      <h1 className="text-3xl font-bold mb-8 capitalize flex items-center gap-2">
        <span className="text-zinc-500">Categoria /</span> 
        <span className="text-cyan-400">{categoria}</span>
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(produto => (
          <ProdutoCard 
            key={produto.id} 
            produto={produto} 
            onAddToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
}