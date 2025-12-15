import Image from 'next/image';
import tecnologias from '@/app/data/tecnologias.json';
import TecnologiaCard from '@/components/MagiaDoJSX/TecnologiaCard';

type Tecnologia = {
  title: string;
  image: string;
  description: string;
  rating: number;
};

export default function TecnologiasPage() {
  const lista: Tecnologia[] = JSON.parse(JSON.stringify(tecnologias));

  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 uppercase tracking-widest text-center">
        Tecnologias Aprendidas
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((tec, i) => (
          <TecnologiaCard key={i} tec={tec} />
        ))}
      </div>
    </div>
  );
}