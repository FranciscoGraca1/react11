import React from 'react';
import { Country } from '@/models/interfaces';
interface PaisProps {
  dados: Country;
}

export default function Pais({ dados }: PaisProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-cyan-500 transition-colors shadow-lg flex flex-col gap-2">
      
      <h3 className="text-xl font-bold text-white mb-2 text-center border-b border-zinc-800 pb-2">
        {dados.name.common.toLocaleString()}
      </h3>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-zinc-500 font-bold uppercase">Área</span>
        <span className="font-mono text-cyan-400">{dados.area.toLocaleString()} km²</span>
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-zinc-500 font-bold uppercase">População</span>
        <span className="font-mono text-cyan-400">{dados.population.toLocaleString()}</span>
      </div>
      
    </div>
  );
}