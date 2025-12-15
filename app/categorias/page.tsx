"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Interface para definir que a categoria é um Objeto com uma propriedade 'name'
interface Category {
  name: string;
}

export default function CategoriasPage() {
  // Alterado: useState agora espera um array de objetos Category
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://deisishop.pythonanywhere.com/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro categorias:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 uppercase tracking-widest">
        DEISIshop // Categorias
      </h2>

      {loading ? (
        <div className="text-purple-400 animate-pulse">A carregar categorias...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categorias.map((cat, index) => (
            <Link
              key={index}
              // CORREÇÃO: Aceder a 'cat.name' para obter o texto correto para o URL
              href={`/deisishop/categorias/${cat.name}`}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl flex flex-col items-center justify-center hover:bg-zinc-800 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-zinc-950 rounded-full border border-zinc-700 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform text-purple-400">
                #
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider group-hover:text-purple-400 transition-colors text-center">
                {/* CORREÇÃO: Aceder a 'cat.name' para mostrar o nome da categoria */}
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}