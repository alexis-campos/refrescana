'use client'

import { useState, useEffect, useCallback } from 'react'
import OrderManager from '@/components/admin/OrderManager'
import { api } from '@/lib/api/endpoints'
import type { Order } from '@/types/api'

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [cleaning, setCleaning] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await api.admin.orders.list()
      setOrders(data.map((o) => ({
        ...o,
        totalAmount: Number(o.totalAmount),
        shippingCost: Number(o.shippingCost),
      })))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCancelExpired = async () => {
    if (!confirm('¿Cancelar todos los pedidos PENDIENTES con más de 3 días sin pago?')) return
    setCleaning(true)
    try {
      const res = await api.admin.orders.cancelExpired(3)
      alert(`Se cancelaron ${res.cancelled} pedido(s) vencido(s).`)
      load()
    } catch {
      alert('Error al cancelar pedidos vencidos.')
    } finally {
      setCleaning(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#1C442A]/20 border-t-[#1C442A] rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={handleCancelExpired}
          disabled={cleaning}
          className="text-sm px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          {cleaning ? 'Cancelando...' : 'Cancelar pendientes vencidos (+3 días)'}
        </button>
      </div>
      <OrderManager
        initialOrders={orders}
        onRefresh={load}
      />
    </div>
  )
}
