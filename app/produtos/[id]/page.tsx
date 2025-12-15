"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/models/interfaces";
import ProdutoDetalhe from '@/components/MagiaDoJSX/ProdutoDetalhe';

// Fetcher para o SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProdutoPage() {
  const params = useParams();
  const router = useRouter();
  
  // Garantir que o id é uma string (pode vir como array se for [...slug])
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // useSWR para obter os dados do produto específico
  // Só executa se tivermos um id (conditional fetching)
  const { data: produto, error, isLoading } = useSWR<Product>(
    id ? `https://deisishop.pythonanywhere.com/products/${id}` : null,
    fetcher
  );

  const handleBack = () => {
    router.push('/produtos');
  };

  if (error) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-red-500 bg-red-950/20 border border-red-900 px-6 py-4 rounded-lg">
        Erro ao carregar o produto. Tente novamente mais tarde.
      </div>
    </div>
  );

  if (isLoading || !produto) return (
    <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
      <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin"></div>
      <p className="text-cyan-500 font-mono animate-pulse uppercase tracking-widest text-sm">
        A carregar dados do produto...
      </p>
    </div>
  );

  return (
    <div className="w-full p-4 md:p-8">
      <ProdutoDetalhe produto={produto} onBack={handleBack} />
    </div>
  );
}