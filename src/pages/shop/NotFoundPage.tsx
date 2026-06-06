import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24"
    >
      <p className="text-8xl font-display font-bold text-primary/10 mb-4">404</p>
      <h1 className="text-3xl font-display font-bold text-primary mb-4">
        Página no encontrada
      </h1>
      <p className="text-text-muted mb-8 max-w-md">
        La página que buscas no existe o fue movida. Vuelve al inicio para encontrar lo que necesitas.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-secondary transition-colors"
      >
        Volver al inicio
      </Link>
    </motion.div>
  )
}
