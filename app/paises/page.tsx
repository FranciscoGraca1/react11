"use client"; // Indica que este componente é renderizado no browser (necessário para usar useState/useEffect)

import React, { useState, useEffect } from 'react';
import { Country } from '@/models/interfaces';
import Pais from '@/components/MagiaDoJSX/Pais';

export default function PaisesPage() {
  // guarda a lista api
  const [countries, setCountries] = useState<Country[]>([]);
  // guarda o texto que odo utilizador
  const [search, setSearch] = useState("");
  // guarda a ordem selecionada
  const [sortOrder, setSortOrder] = useState("pop-desc");
  // controla se ainda estamos à espera da resposta da API (mostra "A carregar...")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/independent?status=true&fields=name,area,population")
      .then((res) => res.json()) // converte a resposta em JSON (dados utilizáveis)
      .then((data) => {
        setCountries(data); // guarda os dados no estado 'countries'
        setLoading(false);  // desliga o aviso de "A carregar"
      })
      .catch((erro) => {
        console.error("Erro ao carregar países:", erro);
        setLoading(false); // mesmo com erro, devemos parar o loading
      });
  }, []);

  // cria uma nova lista baseada na original, mas filtrada e ordenada.
  // isto corre sempre que o 'search', 'sortOrder' ou 'countries' mudam.
  const filteredCountries = countries
    // passo A: Filtrar pelo nome (insensível a maiúsculas/minúsculas)
    .filter((country) => 
      country.name.common.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "pop-asc") {
        return a.population - b.population; // crescente (Menor -> Maior)
      } else if (sortOrder === "pop-desc") {
        return b.population - a.population; // decrescente (Maior -> Menor)
      }
      return 0; // Se não houver ordem definida, não muda nada
    });

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-cyan-500 animate-pulse font-mono bg-black">A carregar países...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans p-8">
      {/* Título da Página */}
      <h1 className="text-4xl font-black text-white text-center mb-8 uppercase tracking-tighter">
        Deisi <span className="text-cyan-500">Paises</span>
      </h1>

      {/* --- barra de Ferramentas (Pesquisa e Ordenação) --- */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-8 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        
        {/* Campo de Texto para Pesquisa */}
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={search} // O valor é controlado pelo estado 'search'
          onChange={(e) => setSearch(e.target.value)} // Ao escrever, atualiza o estado
          className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-all"
        />
        
        {/* Menu Dropdown para Ordenação */}
        <select
          value={sortOrder} // Controlado pelo estado 'sortOrder'
          onChange={(e) => setSortOrder(e.target.value)} // Ao selecionar, atualiza a ordem
          className="bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none cursor-pointer"
        >
          <option value="pop-desc">População: Maior para Menor</option>
          <option value="pop-asc">População: Menor para Maior</option>
        </select>
      </div>

      {/* --- Grelha de Resultados --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Verifica se existem resultados após o filtro */}
        {filteredCountries.length > 0 ? (
          // Se houver, faz um map para criar um componente <Pais /> para cada item
          filteredCountries.map((pais, index) => (
            <Pais key={index} dados={pais} />
          ))
        ) : (
          // Se a lista estiver vazia (ex: pesquisa sem resultados), mostra aviso
          <div className="col-span-full text-center text-zinc-500 py-10 border-2 border-dashed border-zinc-800 rounded-xl">
            Nenhum país encontrado.
          </div>
        )}
      </div>
    </div>
  );
}