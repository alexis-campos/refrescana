'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api/endpoints'
import type { DashboardStats } from '@/types/api'

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val)

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  PAYMENT_UPLOADED: 'Comprobante Enviado',
  PAID: 'Pagado',
  PREPARING: 'En Preparación',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REJECTED: 'Rechazado',
}

const STATUS_CLASSES: Record<string, string> = {
  PAID: 'bg-[#ebf8f0] text-[#1e8a4a] border border-[#d2efe0]',
  PENDING: 'bg-orange-50 text-orange-700 border border-orange-100',
  PAYMENT_UPLOADED: 'bg-purple-50 text-purple-700 border border-purple-100',
  PREPARING: 'bg-blue-50 text-blue-700 border border-blue-100',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  REJECTED: 'bg-red-50 text-red-700 border border-red-100',
  CANCELLED: 'bg-gray-100 text-gray-600 border border-gray-200',
}

const CAT_COLORS = ['bg-[#1C442A]', 'bg-[#4a7657]', 'bg-[#7da38a]', 'bg-[#b0c4b6]']

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.admin.dashboard()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-[#1C442A]/20 border-t-[#1C442A] rounded-full animate-spin" />
    </div>
  )
  if (!stats) return null

  const currentYear = new Date().getFullYear()
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const currentMonthIndex = new Date().getMonth()
  const startMonthIndex = Math.max(0, currentMonthIndex - 6)

  const rawRevenue = stats.monthlyRevenue.map((m) => m.revenue)
  const visibleRevenue = rawRevenue.slice(startMonthIndex, startMonthIndex + 7)
  const maxMonthlyRevenue = Math.max(...visibleRevenue, 1)

  const chartData = visibleRevenue.map((total, idx) => ({
    month: monthNames[startMonthIndex + idx],
    total,
    percentage: (total / maxMonthlyRevenue) * 100,
  }))
  while (chartData.length < 7) {
    const nextIdx = startMonthIndex + chartData.length
    if (nextIdx < 12) chartData.push({ month: monthNames[nextIdx], total: 0, percentage: 0 })
    else break
  }

  return (
    <div className="space-y-8 font-body pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vista General</h1>
          <p className="mt-1 text-sm text-gray-500">Esto es lo que está pasando en Refrescaña hoy.</p>
        </div>
        <a
          href="/api/admin/export/orders"
          download
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar Excel
        </a>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#1C442A] flex items-center justify-center">
              <span className="text-xs font-bold">S/</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="mt-1 text-xs font-medium text-gray-500">Monto total histórico</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-600">Pedidos Totales</p>
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#1C442A] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
            <p className="mt-1 text-xs font-medium text-gray-500">Registrados en el sistema</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-600">Productos Activos</p>
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#1C442A] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
            <p className="mt-1 text-xs font-medium text-gray-500">Visibles en tienda</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-600">Total Clientes</p>
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#1C442A] flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.uniqueClients}</h3>
            <p className="mt-1 text-xs font-medium text-gray-500">Clientes únicos</p>
          </div>
        </div>
      </div>

      {/* Chart & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen de Ingresos ({currentYear})</h3>

          {/* Chart — explicit px heights so percentage resolves correctly */}
          <div className="relative pl-14">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 flex flex-col justify-between text-[10px] text-gray-400 font-medium text-right pr-2" style={{ height: '180px', width: '52px' }}>
              <span>{formatCurrency(maxMonthlyRevenue)}</span>
              <span>{formatCurrency(maxMonthlyRevenue * 0.66)}</span>
              <span>{formatCurrency(maxMonthlyRevenue * 0.33)}</span>
              <span>S/ 0</span>
            </div>

            {/* Bars area */}
            <div className="border-l border-b border-gray-100">
              <div className="flex items-end gap-1.5 px-2" style={{ height: '180px' }}>
                {chartData.map((data, i) => {
                  const barH = Math.round((data.total / maxMonthlyRevenue) * 180)
                  const isActive = i === chartData.length - 1
                  return (
                    <div key={i} className="flex-1 flex items-end justify-center h-full group relative">
                      {/* Tooltip */}
                      {data.total > 0 && (
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {formatCurrency(data.total)}
                        </div>
                      )}
                      {/* Bar */}
                      <div
                        className={`w-full max-w-[40px] rounded-t transition-all duration-500 ${isActive ? 'bg-[#1C442A]' : 'bg-[#d8e0da] group-hover:bg-[#a8bcb0]'}`}
                        style={{ height: `${Math.max(barH, data.total > 0 ? 3 : 1)}px` }}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Month labels — separate row so they never compete with bar height */}
              <div className="flex gap-1.5 px-2 pt-2">
                {chartData.map((data, i) => (
                  <div key={i} className="flex-1 text-center">
                    <span className="text-[10px] text-gray-400 font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Ventas por Categoría</h3>
          <div className="space-y-6">
            {stats.topCategories.length === 0 ? (
              <p className="text-sm text-gray-500">No hay datos suficientes.</p>
            ) : (
              stats.topCategories.map((cat, idx) => {
                const percentage = stats.totalRevenue > 0
                  ? Math.round((cat.count / stats.totalRevenue) * 100)
                  : 0
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700 line-clamp-1 mr-2">{cat.name}</span>
                      <span className="font-bold text-gray-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`${CAT_COLORS[idx % CAT_COLORS.length]} h-1.5 rounded-full`} style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatCurrency(cat.count)}</p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Pedidos Recientes</h3>
          <Link to="/admin/orders" className="text-sm font-medium text-[#1C442A] hover:underline">
            Ver Todos los Pedidos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">ID de Pedido</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No hay pedidos registrados en el sistema.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => {
                  const displayName = order.customerName || 'Cliente'
                  const initials = displayName.substring(0, 2).toUpperCase()
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #ORD-{order.id.slice(0, 4).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#e8f3ec] text-[#1C442A] flex items-center justify-center text-[10px] font-bold">
                            {initials}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{displayName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {formatCurrency(Number(order.totalAmount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_CLASSES[order.status] ?? 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
