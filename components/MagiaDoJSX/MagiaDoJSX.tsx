export default function MagiaDoJSX() {

  const magia = <strong>HTML dentro de JavaScript!</strong>
  const tecnologias = "React e Next.js"

  return (
    <div className='bg-black p-3 m-3 rounded-xl'>
      <p>Este é o meu componente MagiaDoJSX.</p>
      <p>Um componente é uma função que retorna JSX {magia}.</p>
      <p>As componentes são usadas em {tecnologias}.</p>
    </div>
  )
}