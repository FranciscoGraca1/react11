"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/models/interfaces';
import ProductCard from '@/components/MagiaDoJSX/ProdutoCard'; 
import Image from 'next/image';
import ProdutoDetalhe from '@/components/MagiaDoJSX/ProdutoDetalhe';
import HistoricoProdutos from '@/components/MagiaDoJSX/HistoricoDeProdutos'; // <--- IMPORTADO

export default function ProdutosPage() {
  // --- ESTADOS ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Carrinho
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  
  // Checkout
  const [studentName, setStudentName] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [isBuying, setIsBuying] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<any>(null);

  // --- NOVOS ESTADOS: Favoritos e Histórico ---
  const [favorites, setFavorites] = useState<number[]>([]);
  const [history, setHistory] = useState<Product[]>([]);

  // --- EFEITOS ---

  // 1. Carregar API
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
  }, []);

  // 2. Carregar Carrinho, Favoritos e Histórico do LocalStorage
  useEffect(() => {
    // Carrinho
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setIsCartLoaded(true);

    // Favoritos
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavs);

    // Histórico
    const savedHistory = JSON.parse(localStorage.getItem('history') || '[]');
    setHistory(savedHistory);
  }, []);

  // 3. Gravar Carrinho
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  // Lógica de Filtro
  useEffect(() => {
    let novosDados = products.filter(produto => {
      const categoriaCorreta = selectedCategory === "Todas" || produto.category === selectedCategory;
      const pesquisaCorreta = produto.title.toLowerCase().includes(search.toLowerCase());
      return categoriaCorreta && pesquisaCorreta;
    });

    novosDados = novosDados.slice().sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      switch (sortOrder) {
        case "price-asc": return priceA - priceB;
        case "price-desc": return priceB - priceA;
        case "name-asc": return a.title.localeCompare(b.title);
        case "name-desc": return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

    setFilteredData(novosDados);
  }, [search, selectedCategory, sortOrder, products]);

  // --- FUNÇÕES ---

  // Função para gerir favoritos
  const toggleFavorite = (id: number) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(favId => favId !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  // Função para adicionar ao histórico (quando seleciona produto)
  const selectAndAddToHistory = (produto: Product) => {
    setSelectedProduct(produto);
    
    // Filtra se já existe para não duplicar, adiciona no início, mantém apenas 5
    const newHistory = [produto, ...history.filter(p => p.id !== produto.id)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
  };

  const addToCart = (produto: Product) => {
    setCart((prev) => [...prev, produto]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const buy = async () => {
    if (cart.length === 0) return;
    setIsBuying(true);
    setPurchaseResult(null);

    try {
      const response = await fetch("https://deisishop.pythonanywhere.com/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: cart.map(p => p.id),
          name: studentName,
          student: isStudent,
          coupon: coupon
        })
      });

      if (!response.ok) throw new Error("Erro na compra");
      const data = await response.json();
      
      setCart([]); 
      setPurchaseResult(data);
    } catch (error: any) {
      console.error(error);
      alert("Erro ao processar compra.");
    } finally {
      setIsBuying(false);
    }
  };

  const totalCost = cart.reduce((acc, item) => acc + Number(item.price), 0).toFixed(2);

  if (loading) return <div className="flex h-screen items-center justify-center text-cyan-500 animate-pulse font-mono bg-black">A carregar sistema...</div>;

  // Renderização Condicional - Detalhe do Produto
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-black text-gray-200 font-sans p-8 flex items-center justify-center">
        <ProdutoDetalhe 
          produto={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
          onAddToCart={addToCart}
          isFavorite={favorites.includes(selectedProduct.id)}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    );
  }

  // Página Principal
  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-cyan-500/30">
      
      <div className="max-w-[1800px] mx-auto p-4 md:p-8">
        
        {/* CABEÇALHO */}
        <header className="mb-6 text-center md:text-left pb-6 border-b border-zinc-800">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            DEISI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Shop</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm">Hardware & Merch para Developers</p>
        </header>

        {/* HISTÓRICO DE PRODUTOS */}
        <HistoricoProdutos 
          historico={history} 
          onSelectProduct={selectAndAddToHistory} 
        />

        {/* LAYOUT PRINCIPAL */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          
          {/* === COLUNA ESQUERDA: PRODUTOS === */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* BARRA DE FERRAMENTAS */}
            <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl sticky top-4 z-20 shadow-xl">
               <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-zinc-500">🔍</span>
                  <input 
                    type="text"
                    placeholder="Pesquisar produto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 p-3 rounded-xl bg-black border border-zinc-700 text-white focus:border-cyan-500 outline-none transition-all"
                  />
                </div>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-3 rounded-xl bg-black border border-zinc-700 text-white focus:border-cyan-500 outline-none cursor-pointer"
                >
                  <option value="default">Ordenar por...</option>
                  <option value="price-asc">Preço: Menor para Maior</option>
                  <option value="price-desc">Preço: Maior para Menor</option>
                  <option value="name-asc">Nome: A a Z</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("Todas")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${selectedCategory === "Todas" ? "bg-cyan-500 text-black border-cyan-500" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"}`}
                >
                  Todas
                </button>
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${selectedCategory === cat ? "bg-cyan-500 text-black border-cyan-500" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* GRELHA DE PRODUTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.length > 0 ? (
                filteredData.map((produto) => (
                  <div 
                    key={produto.id} 
                    onClick={() => selectAndAddToHistory(produto)}
                    className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                  >
                    <ProductCard 
                      produto={produto}
                      isFavorite={favorites.includes(produto.id)}
                      onToggleFavorite={toggleFavorite}
                      onAddToCart={(p) => {
                        addToCart(p);
                      }} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-2xl">
                  Sem resultados para a sua pesquisa.
                </div>
              )}
            </div>
          </div>

          {/* === COLUNA DIREITA: CARRINHO === */}
          <div className="xl:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-4 shadow-2xl overflow-hidden">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                🛒 O teu Carrinho <span className="bg-cyan-600 text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
              </h2>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 mb-6 scrollbar-thin scrollbar-thumb-zinc-700">
                {cart.length === 0 ? (
                  <p className="text-zinc-500 text-sm italic text-center py-4">Carrinho vazio.</p>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-3 bg-black/50 p-2 rounded-lg border border-zinc-800 group">
                      <div className="relative w-12 h-12 bg-white rounded p-1 shrink-0">
                        <Image 
                          src={item.image.startsWith('http') ? item.image : `https://deisishop.pythonanywhere.com${item.image}`} 
                          alt={item.title} 
                          fill 
                          className="object-contain" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate font-bold">{item.title}</p>
                        <p className="text-xs text-green-400 font-mono">{Number(item.price).toFixed(2)} €</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(index)}
                        className="text-zinc-500 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm font-bold uppercase">Total</span>
                  <span className="text-2xl font-mono text-green-400 font-bold">{totalCost} €</span>
                </div>

                <div className="space-y-3">
                  <input type="text" placeholder="Nome" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none" />
                  <input type="text" placeholder="Cupão" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="w-full bg-black border border-zinc-700 rounded p-2 text-sm text-white focus:border-purple-500 outline-none font-mono" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} className="accent-cyan-500" />
                    <span className="text-xs text-zinc-400">Sou estudante DEISI</span>
                  </label>
                </div>

                <button 
                  onClick={buy}
                  disabled={isBuying || cart.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-lg uppercase text-sm tracking-widest shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBuying ? "A Processar..." : "Finalizar Compra"}
                </button>

                {purchaseResult && (
                  <div className={`p-3 rounded text-xs text-center border ${purchaseResult.error ? "bg-red-900/20 border-red-800 text-red-300" : "bg-green-900/20 border-green-800 text-green-300"}`}>
                    {purchaseResult.error ? (
                      <p>{purchaseResult.error}</p>
                    ) : (
                      <>
                        <p className="font-bold mb-1">Sucesso!</p>
                        <p>Ref: {purchaseResult.reference}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}