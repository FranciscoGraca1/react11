"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/models/interfaces";

export default function CarrinhoPage() {
  const [cart, setCart] = useState<Product[]>([]);
  
  // Estados do Formulário
  const [studentName, setStudentName] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [coupon, setCoupon] = useState("");
  
  // Estados da Compra
  const [isBuying, setIsBuying] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<any>(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  // Cálculo do Total (com conversão segura de string para número)
  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);

  const removerDoCarrinho = (indexToRemove: number) => {
    const newCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const comprar = async () => {
    if (cart.length === 0) return;
    
    setIsBuying(true);
    setPurchaseResult(null);

    try {
      const payload = {
        products: cart.map(p => p.id),
        name: studentName,
        student: isStudent,
        coupon: coupon
      };

      const response = await fetch("https://deisishop.pythonanywhere.com/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro desconhecido na compra");
      }
      
      // Sucesso
      localStorage.removeItem("cart");
      setCart([]);
      setPurchaseResult(data);
      
    } catch (error: any) {
      console.error(error);
      setPurchaseResult({ error: error.message });
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="w-full text-gray-200 p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-wider border-b border-zinc-800 pb-4">
        Checkout <span className="text-cyan-500">DEISI Shop</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLUNA DA ESQUERDA: LISTA DE PRODUTOS === */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-zinc-400 mb-4">O teu carrinho ({cart.length})</h3>
          
          {cart.length === 0 && !purchaseResult ? (
            <div className="p-8 border-2 border-dashed border-zinc-800 rounded-xl text-center text-zinc-500">
              O carrinho está vazio.
            </div>
          ) : (
            cart.map((item, index) => {
               // Tratamento seguro da Imagem
               const imgUrl = item.image.startsWith('http') 
                 ? item.image 
                 : `https://deisishop.pythonanywhere.com${item.image}`;

               return (
                <div key={index} className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                  <div className="relative w-20 h-20 bg-white rounded-lg p-2 shrink-0">
                    <Image 
                      src={imgUrl} 
                      alt={item.title} 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{item.title}</h4>
                    <p className="text-sm text-zinc-400">{item.category}</p>
                    <p className="text-green-400 font-mono font-bold mt-1">{Number(item.price).toFixed(2)} €</p>
                  </div>
                  <button 
                    onClick={() => removerDoCarrinho(index)}
                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-950/30 rounded-full transition-all"
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
               );
            })
          )}
        </div>

        {/* === COLUNA DA DIREITA: FORMULÁRIO E RESUMO === */}
        <div className="space-y-6">
          
          {/* Caixa de Pagamento */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl sticky top-4">
            <h3 className="text-lg font-bold text-white mb-6 flex justify-between items-center">
              <span>Resumo do Pedido</span>
              <span className="text-2xl text-green-400 font-mono">{total.toFixed(2)} €</span>
            </h3>

            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-xs uppercase text-zinc-500 font-bold mb-1">Nome</label>
                <input 
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all"
                  placeholder="Nome do cliente"
                />
              </div>

              {/* Cupão */}
              <div>
                <label className="block text-xs uppercase text-zinc-500 font-bold mb-1">Cupão</label>
                <input 
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition-all font-mono"
                  placeholder="Código promocional"
                />
              </div>

              {/* Checkbox Estudante */}
              <label className="flex items-center gap-3 p-3 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
                <input 
                  type="checkbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500"
                />
                <span className="text-sm text-zinc-300 font-medium">Sou aluno do DEISI</span>
              </label>

              {/* Botão Comprar */}
              <button 
                onClick={comprar}
                disabled={isBuying || cart.length === 0}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 transform active:scale-95"
              >
                {isBuying ? "A Processar..." : "Confirmar Compra"}
              </button>
            </div>
          </div>

          {/* === RESULTADO DA COMPRA (Recibo) === */}
          {purchaseResult && (
            <div className={`p-6 rounded-2xl border-2 ${purchaseResult.error ? "border-red-900 bg-red-950/20" : "border-green-900 bg-green-950/20"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              
              {purchaseResult.error ? (
                <>
                  <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">⚠️ Erro na Compra</h4>
                  <p className="text-red-200 text-sm">{purchaseResult.error}</p>
                </>
              ) : (
                <>
                  <h4 className="text-green-400 font-bold text-center text-xl mb-4 border-b border-green-900/50 pb-4">
                    Compra Efetuada!
                  </h4>
                  
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Pago:</span>
                      <span className="text-white font-bold">{purchaseResult.totalCost} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Referência:</span>
                      <span className="text-white font-bold">{purchaseResult.reference}</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-zinc-500 text-xs">{purchaseResult.message}</p>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}