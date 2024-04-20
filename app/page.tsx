import Image from 'next/image'

import Seller from '@/components/Seller'
Seller
export default function Home() {
  return (
<main className="flex flex-col items-center justify-between p-24 min-h-screen">
  <div className="flex items-center justify-between max-w-5xl w-full font-mono text-sm lg:flex z-10">
    <div className='flext flex-col'>
    <h1 className="text-3xl font-bold">Ecom Frame </h1>
    <p className="mt-4 text-center text-blue-800 leading-relaxed">
      Fill your product details, copy link and paste in frames . Get ready to sell!
    </p>
  </div>
    <div className="mt-8 flex justify-center">
<Seller/>
    </div>
  </div>
</main>


  )
}
