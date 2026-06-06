'use client'

import { useState } from 'react'
import type { ContactMessage } from '@/types/api'
import { api } from '@/lib/api/endpoints'

const MOTIVO_LABELS: Record<string, string> = {
  'consulta-producto':   'Consulta de producto',
  'pedido-mayorista':    'Pedido mayorista',
  'pack-personalizado':  'Pack personalizado',
  'punto-venta':         'Punto de venta',
  'distribuidor':        'Distribuidor',
  'informacion-general': 'Información general',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function getInitials(name: string) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function MessageModal({
  msg,
  onClose,
  onDelete,
}: {
  msg: ContactMessage
  onClose: () => void
  onDelete: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este mensaje permanentemente?')) return
    setDeleting(true)
    try {
      await api.admin.contact.delete(msg.id)
      onDelete(msg.id)
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  const cleanPhone = msg.phone?.replace(/\D/g, '') ?? ''
  const whatsappUrl = cleanPhone
    ? `https://wa.me/51${cleanPhone}?text=${encodeURIComponent(`Hola ${msg.name}, gracias por contactarnos en Refrescaña. Con respecto a tu consulta...`)}`
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{msg.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{formatDate(msg.createdAt)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</span>
              <p className="text-gray-800 mt-0.5">
                <a href={`mailto:${msg.email}`} className="hover:underline text-[#1C442A]">{msg.email}</a>
              </p>
            </div>
            {msg.phone && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Teléfono</span>
                <p className="text-gray-800 mt-0.5">
                  <a href={`tel:${msg.phone}`} className="hover:underline text-[#1C442A]">{msg.phone}</a>
                </p>
              </div>
            )}
            {msg.subject && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Motivo</span>
                <p className="text-gray-800 mt-0.5">{MOTIVO_LABELS[msg.subject] ?? msg.subject}</p>
              </div>
            )}
            {msg.productInterest && msg.productInterest !== 'no-se' && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Producto</span>
                <p className="text-gray-800 mt-0.5 capitalize">{msg.productInterest.replace(/-/g, ' ')}</p>
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Mensaje</span>
            <p className="text-gray-800 mt-1.5 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-4">
              {msg.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${msg.email}?subject=Re: ${MOTIVO_LABELS[msg.subject ?? ''] ?? msg.subject ?? 'Consulta'}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C442A] text-white text-sm font-medium rounded-lg hover:bg-[#163520] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Responder por email
            </a>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:bg-[#1ebe5d] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-3 py-2 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  initialMessages: ContactMessage[]
  unreadCount: number
  onRefresh: () => void
}

export default function MessagesManager({ initialMessages, unreadCount, onRefresh }: Props) {
  const [messages, setMessages]     = useState<ContactMessage[]>(initialMessages)
  const [selected, setSelected]     = useState<ContactMessage | null>(null)
  const [filter, setFilter]         = useState<'all' | 'unread'>('all')
  const [markingAll, setMarkingAll] = useState(false)

  const displayed = filter === 'unread' ? messages.filter(m => !m.isRead) : messages

  const handleOpen = async (msg: ContactMessage) => {
    if (!msg.isRead) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m))
    }
    try {
      const full = await api.admin.contact.get(msg.id)
      setSelected(full)
    } catch {
      setSelected(msg)
    }
  }

  const handleDelete = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    try {
      await api.admin.contact.markRead()
      setMessages(prev => prev.map(m => ({ ...m, isRead: true })))
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mensajes de Contacto</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{unreadCount} sin leer</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Todos ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === 'unread' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sin leer ({messages.filter(m => !m.isRead).length})
            </button>
          </div>
          {messages.some(m => !m.isRead) && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="px-3 py-2 text-sm text-[#1C442A] font-medium border border-[#1C442A]/30 rounded-lg hover:bg-[#1C442A]/5 transition-colors disabled:opacity-50"
            >
              Marcar todos leídos
            </button>
          )}
          <button
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="Actualizar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm font-medium">No hay mensajes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(msg => (
            <button
              key={msg.id}
              onClick={() => handleOpen(msg)}
              className={`w-full text-left rounded-xl border px-5 py-4 transition-all hover:shadow-sm ${
                msg.isRead
                  ? 'bg-white border-gray-100 hover:border-gray-200'
                  : 'bg-[#F0F7F2] border-[#C4E4CD] hover:border-[#1C442A]/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.isRead ? 'bg-gray-100 text-gray-500' : 'bg-[#1C442A] text-white'}`}>
                    {getInitials(msg.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${msg.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {msg.name}
                      </p>
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#1C442A] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{msg.email}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {msg.subject && (
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                          {MOTIVO_LABELS[msg.subject] ?? msg.subject}
                        </span>
                      )}
                      {msg.phone && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                          </svg>
                          {msg.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">{formatDate(msg.createdAt)}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2 ml-12 line-clamp-1">
                {msg.message}
              </p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <MessageModal
          msg={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
