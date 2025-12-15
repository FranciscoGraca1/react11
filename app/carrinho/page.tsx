"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/models/interfaces";

export default function CarrinhoPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState(""); // Ex: nº de aluno
  const [isBuying, setIsBuying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const removerDoCarrinho = (indexToRemove: number) => {
    const newCart = cart.filter((_, index) => index !== indexToRemove);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const comprar = async () => {
    if (cart.length === 0) {
      setMessage("O carrinho está vazio.");
      return;
    }
    
    setIsBuying(true);
    setMessage("");

    try {
      // Payload baseado na estrutura comum da API Deisi Shop
      const payload = {
        name: studentName,
        studentNumber: studentId,
        products: cart.map(p => p.id) // Envia apenas os IDs
      };

      const response = await fetch("https://deisishop.ipvc.pt/api/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Erro na compra");
      }

      const data = await response.json();
      
      // Limpar carrinho após sucesso
      localStorage.removeItem("cart");
      setCart([]);
      setMessage(`Compra realizada com sucesso! ID: ${data.id || "OK"}`);
      
    } catch (error) {
      console.error(error);
      setMessage("Erro ao processar a compra. Verifique os dados.");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="w-full text-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 uppercase tracking-widest">
        Carrinho de Compras
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Produtos */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.length === 0 ? (
            <p className="text-zinc-500 italic">O carrinho está vazio.</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
                <div className="relative w-16 h-16 bg-white rounded p-1">
                  <Image src={item.image} alt={item.title} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-green-400 font-mono text-sm">{item.price.toFixed(2)} €</p>
                </div>
                <button 
                  onClick={() => removerDoCarrinho(index)}
                  className="text-red-500 hover:text-red-400 font-bold px-2"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Resumo e Checkout */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl h-fit">
          <h3 className="text-xl font-bold text-white mb-4">Resumo</h3>
          
          <div className="flex justify-between mb-6 text-lg">
            <span>Total</span>
            <span className="font-mono text-green-400 font-bold">{total.toFixed(2)} €</span>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <label className="text-xs text-zinc-500 uppercase">Nome</label>
            <input 
              type="text" 
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
              placeholder="Seu Nome"
            />
            
            <label className="text-xs text-zinc-500 uppercase">Nº Aluno (Opcional)</label>
            <input 
              type="text" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
              placeholder="Ex: 12345"
            />
          </div>

          <button 
            onClick={comprar}
            disabled={isBuying || cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded font-bold uppercase tracking-wide transition-all"
          >
            {isBuying ? "A Processar..." : "Comprar Agora"}
          </button>

          {message && (
            <p className={`mt-4 text-center text-sm font-bold ${message.includes("Erro") ? "text-red-500" : "text-green-400"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}