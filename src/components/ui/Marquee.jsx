import { motion } from 'framer-motion'

const items = [
  'ANIME TEES', '•', 'OVERSIZED FIT', '•', 'DTF PRINTED', '•', 'STREETWEAR', '•',
  'CODING APPAREL', '•', 'WEAR YOUR VIBE', '•', 'PREMIUM COTTON', '•', 'NEW DROPS', '•',
]

export default function Marquee() {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-white/5 py-4 bg-black/40">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="mx-6 text-sm font-bold tracking-[0.3em] text-white/30 uppercase">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
