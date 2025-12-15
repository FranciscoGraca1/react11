import Image from 'next/image';
import ContadorPersonalizado from './ContadorPersonalizado';

type Tecnologia = {
  title: string;
  image: string;
  description: string;
  rating: number;
};

export default function TecnologiaCard({ tec }: { tec: Tecnologia }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col items-center hover:border-cyan-500/30 transition-colors shadow-lg group">
      <div className="relative w-[100px] h-[100px] mb-4 p-2 bg-black/50 rounded-full border border-zinc-700 group-hover:border-cyan-500/50 transition-colors">
        <Image
          src={`/tecnologias/${tec.image}`}
          alt={`Logotipo de ${tec.title}`}
          width={80}
          height={80}
          className="object-contain w-full h-full"
        />
      </div>

      <h3 className="text-lg font-bold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">
        {tec.title}
      </h3>

      <p className="text-sm text-gray-400 mb-4 text-center line-clamp-3">
        {tec.description}
      </p>

      <div className="flex flex-col items-center gap-3 w-full mt-auto">
        <div className="text-yellow-500 text-sm tracking-widest">
          {'⭐'.repeat(tec.rating)}
        </div>
        
        {/* Integração do Contador */}
        <ContadorPersonalizado title={tec.title} />
      </div>
    </div>
  );
}