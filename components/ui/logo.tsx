import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Image src="/images/JuanderBot Logo.png" alt="JuanderBot Logo" width={40} height={40} />
      <span className="text-xl font-bold">Juander Bot</span>
    </div>
  )
}

