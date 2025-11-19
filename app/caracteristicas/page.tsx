"use client";

import React from "react";

export default function Page() {

  const caracteristicas = [
    "JSX, sintaxe que mistura HTML e JS.",
    "Componentes, funções que retornam JSX.",
    "Componentes Reutilizáveis e Modulares.",
    "Roteamento Automático e APIs.",
    "Hooks: useState, useEffect e useSWR.",
    "Renderização Rápida e SEO Friendly.",
    "TypeScript Seguro e Escalável.",
    "Comunidade Ativa e Popularidade."
  ];

  function eventoBrutal() {
    alert("🔥 React & Next.js são os reis do frontend!");
  }

  return (
    <div className="p-6">
      <h2 
        className="text-2xl font-bold mb-4 cursor-pointer"
        onClick={eventoBrutal}
      >
        Características do React e Next.js
      </h2>

      <ul className="list-disc ml-6 space-y-2">
        {caracteristicas.map((caracteristica, i) => (
          <li key={i}>{caracteristica}</li>
        ))}
      </ul>
    </div>
  );
}