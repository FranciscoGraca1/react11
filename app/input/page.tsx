"use client";

import React, { useState } from "react";

type Tarefa = {
  id: number;
  texto: string;
};

const categorias = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"];

export default function InputPage() {
  const [textoEspelhado, setTextoEspelhado] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(categorias[0]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEdicao, setTextoEdicao] = useState("");

  const adicionarTarefa = () => {
    if (!novaTarefa.trim()) return;
    const tarefa: Tarefa = { id: Date.now(), texto: novaTarefa };
    setTarefas([...tarefas, tarefa]);
    setNovaTarefa("");
  };

  const apagarTarefa = (id: number) => {
    setTarefas(tarefas.filter((t) => t.id !== id));
  };

  const iniciarEdicao = (tarefa: Tarefa) => {
    setEditandoId(tarefa.id);
    setTextoEdicao(tarefa.texto);
  };

  const guardarEdicao = () => {
    setTarefas(
      tarefas.map((t) =>
        t.id === editandoId ? { ...t, texto: textoEdicao } : t
      )
    );
    setEditandoId(null);
    setTextoEdicao("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-10 text-white">
      <h2 className="text-3xl font-bold text-center mb-4">Laboratório de Inputs</h2>

      {/* SEÇÃO 1 - Cores escuras */}
      <section className="bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">1. Texto Espelhado</h3>
        <input
          type="text"
          value={textoEspelhado}
          onChange={(e) => setTextoEspelhado(e.target.value)}
          placeholder="Digite algo aqui..."
          // Input escuro
          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md mb-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <div className="p-3 bg-zinc-900 border border-zinc-700 rounded min-h-[50px]">
          <span className="text-gray-500 text-sm">Resultado:</span>
          <p className="text-lg font-medium text-blue-400">
            {textoEspelhado || "..."}
          </p>
        </div>
      </section>

      {/* SEÇÃO 2 - Cores escuras */}
      <section className="bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">2. Seletor de Tecnologia</h3>
        <select
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
          // Select escuro
          className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:border-blue-500"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <p className="mt-4 text-gray-300">
          Você escolheu: <span className="font-bold text-blue-400">{categoriaSelecionada}</span>
        </p>
      </section>

      {/* SEÇÃO 3 - Cores escuras */}
      <section className="bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">3. Lista de Tarefas</h3>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="Nova tarefa..."
            className="flex-1 p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
          />
          <button
            onClick={adicionarTarefa}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Inserir
          </button>
        </div>

        <ul className="space-y-3">
          {tarefas.map((tarefa) => (
            <li
              key={tarefa.id}
              className="bg-zinc-700 p-3 rounded shadow-sm flex items-center justify-between border border-zinc-600"
            >
              {editandoId === tarefa.id ? (
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    value={textoEdicao}
                    onChange={(e) => setTextoEdicao(e.target.value)}
                    className="flex-1 p-1 bg-zinc-800 border border-zinc-500 rounded text-white"
                  />
                  <button onClick={guardarEdicao} className="text-green-400 hover:text-green-300 font-bold px-2">V</button>
                  <button onClick={() => setEditandoId(null)} className="text-gray-400 hover:text-gray-200 px-2">X</button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-gray-200">{tarefa.texto}</span>
                  <div className="flex gap-2">
                    <button onClick={() => iniciarEdicao(tarefa)} className="text-yellow-500 hover:text-yellow-400 text-sm px-2 py-1 border border-yellow-500/30 rounded hover:bg-yellow-500/10">Editar</button>
                    <button onClick={() => apagarTarefa(tarefa.id)} className="text-red-500 hover:text-red-400 text-sm px-2 py-1 border border-red-500/30 rounded hover:bg-red-500/10">Apagar</button>
                  </div>
                </>
              )}
            </li>
          ))}
          {tarefas.length === 0 && (
            <p className="text-center text-gray-500 italic">Sem tarefas na lista.</p>
          )}
        </ul>
      </section>
    </div>
  );
}