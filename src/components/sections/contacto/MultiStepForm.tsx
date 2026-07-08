'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import Link from '@/components/ui/NavLink'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { api } from '@/lib/api/endpoints'

type Product = { name: string; slug: string }

const contactSchema = z.object({
  name:            z.string().min(2, 'Mínimo 2 caracteres'),
  email:           z.string().email('Email inválido'),
  phone:           z.string().min(9, 'Mínimo 9 dígitos').regex(/^[\d\s+\-()]+$/, 'Solo dígitos'),
  subject:         z.string().min(1, 'Selecciona un motivo'),
  productInterest: z.string().optional(),
  message:         z.string().min(10, 'Mínimo 10 caracteres'),
})

type ContactFormData = z.infer<typeof contactSchema>

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const MOTIVOS = [
  { value: 'consulta-producto',   label: 'Consulta de producto' },
  { value: 'pedido-mayorista',    label: 'Pedido mayorista' },
  { value: 'pack-personalizado',  label: 'Pack personalizado' },
  { value: 'punto-venta',         label: 'Ser punto de venta' },
  { value: 'distribuidor',        label: 'Ser distribuidor' },
  { value: 'informacion-general', label: 'Información general' },
]

/* ── Underline input ─────────────────────────────────────── */
interface LineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const LineInput = ({ label, error, className, ...props }: LineInputProps) => (
  <div className={cn('relative group', className)}>
    <label className={cn(
      'block font-body text-xs uppercase tracking-[0.12em] mb-2 transition-colors duration-200',
      error ? 'text-red-400' : 'text-text/40 group-focus-within:text-primary',
    )}>
      {label}
    </label>
    <input
      {...props}
      className={cn(
        'w-full bg-transparent border-b pb-3 font-body text-[length:var(--text-body)] text-text',
        'placeholder:text-text/20 outline-none transition-colors duration-300',
        error
          ? 'border-red-400'
          : 'border-[var(--color-border)] focus:border-primary',
      )}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 font-body text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

/* ── Underline textarea ──────────────────────────────────── */
interface LineTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

const LineTextarea = ({ label, error, ...props }: LineTextareaProps) => (
  <div className="relative group">
    <label className={cn(
      'block font-body text-xs uppercase tracking-[0.12em] mb-2 transition-colors duration-200',
      error ? 'text-red-400' : 'text-text/40 group-focus-within:text-primary',
    )}>
      {label}
    </label>
    <textarea
      {...props}
      className={cn(
        'w-full bg-transparent border-b pb-3 font-body text-[length:var(--text-body)] text-text',
        'placeholder:text-text/20 outline-none resize-none transition-colors duration-300',
        error ? 'border-red-400' : 'border-[var(--color-border)] focus:border-primary',
      )}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 font-body text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
)

/* ── Left info panel ─────────────────────────────────────── */
function InfoPanel() {
  return (
    <div className="flex flex-col justify-center lg:pr-12">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="font-serif font-medium text-accent text-sm uppercase tracking-[0.2em] mb-4"
      >
        Estamos aquí
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
        className="font-display font-bold text-text text-[length:var(--text-h1)] leading-tight tracking-tight mb-6"
      >
        Cuéntanos{' '}
        <span className="text-secondary italic">qué necesitas</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
        className="font-body text-text-muted text-[length:var(--text-body)] leading-relaxed mb-10"
      >
        Ya sea una consulta, un pedido mayorista o quieras ser punto de venta,
        te respondemos en menos de 24 horas.
      </motion.p>

      {/* Contact channels */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
        className="space-y-5"
      >
        {[
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5C21 16.75 16.75 21 11.5 21c-1.4 0-2.74-.31-3.93-.87L3 22l1.9-4.58C3.7 16.22 3 14.56 3 12.73 3 7.48 7.25 3 12.5 3S22 7.25 22 12.5" />
                <path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth="2" />
              </svg>
            ),
            label: 'WhatsApp',
            value: '+51 943 501 918',
            href: 'https://wa.me/51943501918',
          },
          {
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            ),
            label: 'Email',
            value: 'refrescana.com@gmail.com',
            href: 'mailto:refrescana.com@gmail.com',
          },
        ].map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group"
          >
            <span className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-bg transition-all duration-300">
              {c.icon}
            </span>
            <div>
              <p className="font-body text-xs uppercase tracking-[0.12em] text-text/40 leading-none mb-1">{c.label}</p>
              <p className="font-body text-[length:var(--text-body)] text-text font-medium group-hover:text-primary transition-colors duration-200">
                {c.value}
              </p>
            </div>
          </a>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Success screen ──────────────────────────────────────── */
function Confirmacion({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center gap-8 py-12"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {/* Animated check */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-accent/30 flex items-center justify-center">
          <svg viewBox="0 0 64 64" fill="none" className="w-9 h-9">
            <motion.path
              d="M16 34L28 46L48 22"
              stroke="var(--color-secondary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            />
          </svg>
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border border-accent/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        />
      </div>

      <div>
        <h3 className="font-display font-bold text-text text-[length:var(--text-h2)] tracking-tight mb-3">
          Mensaje enviado
        </h3>
        <p className="font-body text-text-muted text-[length:var(--text-body)] leading-relaxed max-w-xs mx-auto">
          Te responderemos en menos de 24 horas al email o WhatsApp que nos dejaste.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/productos"
          className="font-body text-sm font-semibold text-primary hover:text-secondary transition-colors duration-200 inline-flex items-center gap-1.5 group"
        >
          <span>Explorar productos</span>
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
        <span className="w-px h-4 bg-[var(--color-border)] hidden sm:block" />
        <button
          onClick={onReset}
          className="font-body text-sm text-text/40 hover:text-text transition-colors duration-200"
        >
          Enviar otro mensaje
        </button>
      </div>
    </motion.div>
  )
}

/* ── Main component ──────────────────────────────────────── */
export function MultiStepForm({ products }: { products: Product[] }) {
  const [enviado, setEnviado]     = useState(false)
  const [apiError, setApiError]   = useState<string | null>(null)
  const [motivo, setMotivo]       = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactFormData) => {
    setApiError(null)
    try {
      await api.contact.send({
        name:            data.name,
        email:           data.email,
        phone:           data.phone,
        subject:         data.subject,
        productInterest: data.productInterest || undefined,
        message:         data.message,
      })
      setEnviado(true)
    } catch {
      setApiError('Error al enviar. Por favor inténtalo de nuevo.')
    }
  }

  const handleReset = () => {
    reset()
    setMotivo('')
    setEnviado(false)
    setApiError(null)
  }

  const selectMotivo = (val: string) => {
    setMotivo(val)
    setValue('subject', val, { shouldValidate: true })
  }

  return (
    <section className="py-[var(--section)] bg-surface">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: info */}
          <InfoPanel />

          {/* Right: form */}
          <div>
            <AnimatePresence mode="wait">
              {enviado ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <Confirmacion onReset={handleReset} />
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="flex flex-col gap-8"
                >
                  {/* Name */}
                  <LineInput
                    {...register('name')}
                    label="Nombre completo"
                    placeholder="Tu nombre y apellido"
                    error={errors.name?.message}
                  />

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <LineInput
                      {...register('email')}
                      type="email"
                      label="Correo electrónico"
                      placeholder="correo@ejemplo.com"
                      error={errors.email?.message}
                    />
                    <LineInput
                      {...register('phone')}
                      type="tel"
                      inputMode="tel"
                      label="Teléfono / WhatsApp"
                      placeholder="987 654 321"
                      error={errors.phone?.message}
                    />
                  </div>

                  {/* Motivo — pill chips */}
                  <div>
                    <p className={cn(
                      'font-body text-xs uppercase tracking-[0.12em] mb-3 transition-colors',
                      errors.subject ? 'text-red-400' : 'text-text/40',
                    )}>
                      Motivo de consulta
                    </p>
                    {/* hidden field for react-hook-form */}
                    <input type="hidden" {...register('subject')} />
                    <div className="flex flex-wrap gap-2">
                      {MOTIVOS.map((m) => (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => selectMotivo(m.value)}
                          className={cn(
                            'px-4 py-2 rounded-full font-body text-sm border transition-all duration-200',
                            motivo === m.value
                              ? 'bg-primary text-bg border-primary'
                              : 'bg-transparent border-[var(--color-border)] text-text/60 hover:border-primary hover:text-primary',
                          )}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <AnimatePresence>
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-2 font-body text-xs text-red-400"
                        >
                          {errors.subject.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Product interest — underline select */}
                  {products.length > 0 && (
                    <div className="relative group">
                      <label className="block font-body text-xs uppercase tracking-[0.12em] text-text/40 mb-2 group-focus-within:text-primary transition-colors duration-200">
                        Producto de interés <span className="normal-case not-italic text-text/25">(opcional)</span>
                      </label>
                      <div className="relative">
                        <select
                          {...register('productInterest')}
                          className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-primary pb-3 font-body text-[length:var(--text-body)] text-text outline-none appearance-none cursor-pointer transition-colors duration-300"
                        >
                          <option value="">Ninguno / todos los productos</option>
                          {products.map(p => (
                            <option key={p.slug} value={p.slug}>{p.name}</option>
                          ))}
                          <option value="no-se">Aún no lo sé</option>
                        </select>
                        <svg className="pointer-events-none absolute right-1 top-1 w-4 h-4 text-text/30" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 6L8 10L12 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <LineTextarea
                    {...register('message')}
                    label="Mensaje"
                    rows={4}
                    placeholder="Cuéntanos con detalle lo que necesitas..."
                    error={errors.message?.message}
                  />

                  {/* API error */}
                  <AnimatePresence>
                    {apiError && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-body text-sm text-red-500 text-center"
                      >
                        {apiError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        'w-full py-4 rounded-[var(--radius-md)] font-body font-semibold text-[length:var(--text-body)]',
                        'bg-primary text-bg transition-all duration-300',
                        'hover:bg-secondary hover:text-bg',
                        'disabled:opacity-60 disabled:cursor-not-allowed',
                        'flex items-center justify-center gap-2 group',
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar mensaje
                          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
