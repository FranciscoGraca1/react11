"use client";

import React, { useState, useEffect } from "react";

type ContadorProps = {
  title: string;
};

export default function ContadorPersonalizado({ title }: ContadorProps) {
  const [likes, setLikes] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Chave única para o localStorage baseada no título
  const storageKey = `likes_${title.replace(/\s+/g, '_').toLowerCase()}`;

  useEffect(() => {
    const savedLikes = localStorage.getItem(storageKey);
    if (savedLikes) {
      setLikes(Number(savedLikes));
    }
    setMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(storageKey, likes.toString());
    }
  }, [likes, mounted, storageKey]);

  if (!mounted) return null; // Evita erro de hidratação

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Evita navegação se estiver dentro de um Link
        setLikes((prev) => prev + 1);
      }}
      className="flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-950/30 border border-pink-900/50 rounded-full hover:bg-pink-900/50 hover:border-pink-500 transition-all duration-300 group"
    >
      <span className="group-hover:scale-125 transition-transform duration-200">♥</span>
      <span>{likes} Likes</span>
    </button>
  );
}