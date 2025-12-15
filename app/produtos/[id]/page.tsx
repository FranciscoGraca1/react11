"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/models/interfaces';
import ProductCard from '@/components/MagiaDoJSX/ProdutoCard'; 

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  
  // 1. Estado do Carrinho
  const [cart, setCart] = useState<Product[]>([]);

  // Carregar dados iniciais e Carrinho do LocalStorage
  useEffect(() => {
    Promise.all([
      fetch('https://deisishop.pythonanywhere.com/products').then(res => res.json()),
      fetch('https://deisishop.pythonanywhere.com/categories').then(res => res.json())
    ])
    .then(([dadosProdutos, dadosCategorias]) => {
      setProducts(dadosProdutos);
      const categoriasLimpas = dadosCategorias.map((cat: any) => 
          typeof cat === 'string' ? cat : cat.name || String(cat)
      );
      setCategories(categoriasLimpas);
      setLoading(false);
    })
    .catch(erro => console.error("Erro:", erro));

    // Carregar carrinho salvo
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  // 2. Guardar Carrinho no LocalStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Filtragem e Ordenação
  useEffect(() => {
    let novosDados = products.filter(produto => {
      const categoriaCorreta = selectedCategory === "Todas" || produto.category === selectedCategory;
      const pesquisaCorreta = produto.title.toLowerCase().includes(search.toLowerCase());
      return categoriaCorreta && pesquisaCorreta;
    });

    novosDados = novosDados.slice().sort((a, b) => {
      switch (sortOrder) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-asc": return a.title.localeCompare(b.title);
        case "name-desc": return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    setFilteredData(novosDados);
  }, [search, selectedCategory, sortOrder, products]);

  // Função Adicionar ao Carrinho
  const addToCart = (produto: Product) => {
    setCart((prevCart) => [...prevCart, produto]);
  };

  // Função Remover do Carrinho (remove pelo índice para permitir duplicados se necessário)
  const removeFromCart = (indexToRemove: number) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  // Função Comprar (Limpa o carrinho - Simulação)
  const buy = () => {
    fetch('https://deisishop.pythonanywhere.com/buy', {
      method: 'POST',
      body: JSON.stringify({ products: cart.map(p => p.id), name: "", studentNumber: "" }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then(response => {
        if(response.ok) {
            alert("Compra realizada com sucesso!");
            setCart([]); // Limpa o carrinho
        } else {
            alert("Erro na compra");
        }
    })
    .catch(err => console.log(err));
  };

  // Cálculo do Custo Total
  const totalCost = cart.reduce((total, item) => total + Number(item.price), 0).toFixed(2);

  if (loading) return <div className="text-center p-10 text-cyan-500 animate-pulse font-mono">A carregar catálogo...</div>;

  return (
    <div className="w-full p-6 max-w-7xl mx-auto flex flex-col gap-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 text-center drop-shadow-md uppercase tracking-widest">
        Loja DEISI Shop
      </h1>

      {/* Secção do Carrinho */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Carrinho ({cart.length})</h2>
            <div className="text-right">
                <span className="text-zinc-400 text-sm">Total a Pagar:</span>
                <p className="text-3xl font-mono text-green-400 font-bold">{totalCost} €</p>
            </div>
        </div>
        
        {cart.length > 0 ? (
            <>
                <div className="flex gap-4 overflow-x-auto pb-4 mb-4">
                    {cart.map((produto, index) => (
                        <div key={`${produto.id}-${index}`} className="min-w-[250px] w-[250px]">
                            <ProductCard 
                                produto={produto} 
                                onRemoveFromCart={() => removeFromCart(index)} 
                            />
                        </div>
                    ))}
                </div>
                <button 
                    onClick={buy} 
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg uppercase tracking-wide transition-all"
                >
                    Comprar Tudo
                </button>
            </>
        ) : (
            <p className="text-zinc-500 italic">O seu carrinho está vazio.</p>
        )}
      </div>

      {/* Filtros e Pesquisa */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text"
            placeholder="Pesquisar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-zinc-700 bg-black text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-3 rounded-lg border border-zinc-700 bg-black text-gray-200 focus:outline-none focus:border-cyan-500 transition-colors md:w-64"
          >
            <option value="default">Ordenar por...</option>
            <option value="price-asc">Preço: Menor para Maior</option>
            <option value="price-desc">Preço: Maior para Menor</option>
            <option value="name-asc">Nome: A a Z</option>
            <option value="name-desc">Nome: Z a A</option>
          </select>
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

      {/* Lista de Produtos Disponíveis */}
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