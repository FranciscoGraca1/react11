"use client";

import { useState, useEffect } from "react";

export default function Relogio() {
  // Estado para guardar a hora formatada
  const [hora, setHora] = useState<string>("");

  useEffect(() => {
    // Função para atualizar a hora
    const atualizarHora = () => {
      const agora = new Date();
      // Formata a hora para o padrão português (HH:MM:SS)
      setHora(agora.toLocaleTimeString("pt-PT"));
    };

    // Atualiza imediatamente ao montar
    atualizarHora();

    // Configura o intervalo para atualizar a cada 1000ms (1 segundo)
    const intervalId = setInterval(atualizarHora, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);

  // Se a hora ainda não estiver carregada (durante a renderização no servidor), não mostra nada
  // Isto evita erros de "Hydration Mismatch"
  if (!hora) return null;

  return (
    <div className="font-mono bg-gray-200 px-2 py-1 rounded text-black text-sm">
      {hora}
    </div>
  );
}