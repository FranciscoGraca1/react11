"use client";

import React, { useState, useEffect } from "react";

export default function Contador() {
  const [valor, setValor] = useState(0);
  const [historico, setHistorico] = useState<number[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const valorSalvo = localStorage.getItem("contador_valor");
    const historicoSalvo = localStorage.getItem("contador_historico");

    if (valorSalvo) setValor(Number(valorSalvo));
    if (historicoSalvo) setHistorico(JSON.parse(historicoSalvo));
    
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("contador_valor", valor.toString());
      localStorage.setItem("contador_historico", JSON.stringify(historico));
    }
  }, [valor, historico, carregado]);

  const alterarValor = (novoValor: number) => {
    if (novoValor >= 0 && novoValor <= 10) {
      setValor(novoValor);
      setHistorico((prev) => [...prev, novoValor]);
    }
  };

  const resetar = () => {
    setValor(0);
    setHistorico((prev) => [...prev, 0]);
  };

  // Cores ligeiramente mais claras para fundo escuro
  let corTexto = "text-red-500"; 
  if (valor >= 4 && valor <= 7) {
    corTexto = "text-yellow-400"; 
  } else if (valor >= 8) {
    corTexto = "text-green-400"; 
  }

  if (!carregado) return <p>Carregando...</p>;

  return (
    // ALTERAÇÃO: bg-zinc-800 e border-zinc-700
    <div className="flex flex-col items-center gap-4 p-4 border border-zinc-700 rounded-lg shadow-sm bg-zinc-800">
      
      <div className={`text-6xl font-bold ${corTexto}`}>
        {valor}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => alterarValor(valor - 1)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={valor <= 0}
        >
          - Decrementar
        </button>
        
        {/* Botão cinza ajustado para fundo escuro */}
        <button 
          onClick={resetar}
          className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500"
        >
          Reset
        </button>

        <button 
          onClick={() => alterarValor(valor + 1)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          disabled={valor >= 10}
        >
          Incrementar +
        </button>
      </div>

      <div className="mt-6 w-full">
        <h3 className="text-lg font-semibold mb-2 text-center text-gray-200">Histórico:</h3>
        <ul className="flex flex-wrap gap-2 justify-center">
          {historico.map((val, index) => (
            // Items do histórico em cinza escuro
            <li key={index} className="border border-zinc-600 px-2 py-1 rounded bg-zinc-700 text-sm text-gray-200">
              {val}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}