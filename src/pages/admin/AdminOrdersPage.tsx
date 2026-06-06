'use client'

import { useState, useEffect, useCallback } from 'react'
import OrderManager from '@/components/admin/OrderManager'
import { api } from '@/lib/api/endpoints'
import type { Order } from '@/types/api'

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#1C442A]/20 border-t-[#1C442A] rounded-full animate-spin" />
    </div>
  )

  return (
    <OrderManager
      initialOrders={orders}
      onRefresh={load}
    />
  )
}
