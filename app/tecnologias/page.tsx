import Image from 'next/image';
import tecnologias from '@/app/tecnologias.json';

type Tecnologia = {
  title: string;
  image: string;
  description: string;
  rating: number;
};

export default function TecnologiasPage() {
  
  const lista: Tecnologia[] = JSON.parse(JSON.stringify(tecnologias));

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-600">
        Tecnologias aprendidas
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((tec, i) => {
          return (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <Image
                src={`/tecnologias/${tec.image}`}
                alt={`Logotipo de ${tec.title}`}
                width={120}
                height={120}
                className="mb-3"
              />

              <h3 className="text-lg text-gray-500 font-semibold mb-1">
                {tec.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3 text-center">
                {tec.description}
              </p>

              <p className="font-semibold text-yellow-500">
                {'⭐'.repeat(tec.rating)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}