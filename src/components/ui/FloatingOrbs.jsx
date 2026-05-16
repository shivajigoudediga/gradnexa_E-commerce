import { motion } from 'framer-motion'

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, 80, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[90px]"
      />
    </div>
  )
}
