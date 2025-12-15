"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/models/interfaces';
import ProductCard from '@/components/MagiaDoJSX/ProdutoCard'; // Ajuste o caminho se necessário

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  
  // Novo estado para os dados filtrados (Requisito da pesquisa)
  const [filteredData, setFilteredData] = useState<Product[]>([]);

  // 1. Carregar dados
  useEffect(() => {
    Promise.all([
      fetch('https://deisishop.pythonanywhere.com/products').then(res => res.json()),
      fetch('https://deisishop.pythonanywhere.com/categories').then(res => res.json())
    ])
    .then(([dadosProdutos, dadosCategorias]) => {
      setProducts(dadosProdutos);
      
      const categoriasLimpas = dadosCategorias.map((cat: any) => {
          if (typeof cat === 'string') return cat;
          return cat.name || String(cat);
      });
      
      setCategories(categoriasLimpas);
      setLoading(false);
    })
    .catch(erro => {
      console.error("Erro ao carregar a loja:", erro);
      setLoading(false);
    });
  }, []);

  // 2. useEffect para Filtragem (Requisito da pesquisa)
  useEffect(() => {
    const novosDados = products.filter(produto => {
      const categoriaCorreta = selectedCategory === "Todas" || produto.category === selectedCategory;
      const pesquisaCorreta = produto.title.toLowerCase().includes(search.toLowerCase());
      return categoriaCorreta && pesquisaCorreta;
    });
    setFilteredData(novosDados);
  }, [search, selectedCategory, products]);

  // Função de Comprar
  const addToCart = (produto: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(produto);
    localStorage.setItem("cart", JSON.stringify(cart));
    // Opcional: Feedback visual mais subtil que o alert
    alert(`Produto adicionado: ${produto.title}`);
  };

  if (loading) return <div className="text-center p-10 text-cyan-500 animate-pulse font-mono">A carregar catálogo...</div>;

  return (
    <div className="w-full p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-8 text-center drop-shadow-md uppercase tracking-widest">
        Loja DEISI Shop
      </h1>

      {/* Filtros e Pesquisa */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg mb-8">
        <div className="mb-6">
          <input 
            type="text"
            placeholder="Pesquisar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border border-zinc-700 bg-black text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory("Todas")}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all border ${selectedCategory === "Todas" ? "bg-cyan-900/30 text-cyan-400 border-cyan-500" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"}`}
          >
            Todas
          </button>
          
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all capitalize border ${selectedCategory === category ? "bg-cyan-900/30 text-cyan-400 border-cyan-500" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Produtos (Usa filteredData) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((produto) => (
            <ProductCard 
              key={produto.id} 
              produto={produto}
              onAddToCart={addToCart} 
            />
          ))
        ) : (
          <p className="text-zinc-500 col-span-full text-center italic">
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </div>
  );
}