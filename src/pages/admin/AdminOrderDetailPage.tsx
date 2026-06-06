'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { OrderDetailView } from '@/components/admin/OrderDetailView'
import { api } from '@/lib/api/endpoints'
import { ApiError } from '@/lib/api/http'
import type { Order } from '@/types/api'

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    try {
      const data = await api.admin.orders.get(id)
      setOrder({
        ...data,
        totalAmount: Number(data.totalAmount),
        shippingCost: Number(data.shippingCost),
        items: data.items.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      })
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  if (notFound) return <Navigate to="/admin/orders" replace />
  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#1C442A]/20 border-t-[#1C442A] rounded-full animate-spin" />
    </div>
  )
  if (!order) return null

  return <OrderDetailView order={order} onRefresh={load} />
}
