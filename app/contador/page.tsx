import React from "react";
import Contador from "@/components/MagiaDoJSX/Contador"; 

export default function ContadorPage() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Contador Inteligente
      </h2>
      <p className="mb-4 text-center">
        Este contador mantém o estado mesmo se recarregares a página (LocalStorage).
      </p>
      
      <Contador />
    </div>
  );
}