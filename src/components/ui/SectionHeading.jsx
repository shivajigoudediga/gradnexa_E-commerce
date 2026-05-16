import { motion } from 'framer-motion'
import { fadeInUp } from '../../animations/variants'

export default function SectionHeading({ title, subtitle, align = 'left' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeInUp}
      className={`mb-14 ${align === 'center' ? 'text-center' : ''}`}
    >
      <div className={`section-line mb-6 ${align === 'center' ? 'mx-auto max-w-xs' : 'max-w-[120px]'}`} />
      {subtitle && (
        <p className="text-purple-400 text-xs font-bold tracking-[0.25em] uppercase mb-3">{subtitle}</p>
      )}
      <h2 className="text-4xl sm:text-5xl font-bold font-[Space_Grotesk]">
        <span className="gradient-text">{title}</span>
      </h2>
    </motion.div>
  )
}
