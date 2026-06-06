
import { useState } from "react";
import { Link } from 'react-router-dom';
import { Modal } from "@/components/ui/Modal";
import { ExternalOrderModal } from "@/components/admin/ExternalOrderModal";

interface Order {
  id: string;
  customerName?: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  source?: string | null;
  createdAt: string | Date;
  receiptNumber?: string | null;
  user?: { name: string | null; email: string | null } | null;
}

const STATUS_MAP: Record<string, { label: string; dotColor: string; bgColor: string }> = {
  PENDING:          { label: "Pendiente",           dotColor: "bg-orange-500", bgColor: "bg-orange-50 text-orange-700" },
  PAYMENT_UPLOADED: { label: "Comprobante Enviado", dotColor: "bg-purple-500", bgColor: "bg-purple-50 text-purple-700" },
  PAID:             { label: "Pagado",              dotColor: "bg-green-500",  bgColor: "bg-green-50 text-green-700" },
  PREPARING:        { label: "En Preparación",      dotColor: "bg-blue-500",   bgColor: "bg-blue-50 text-blue-700" },
  SHIPPED:          { label: "Enviado",             dotColor: "bg-indigo-500", bgColor: "bg-indigo-50 text-indigo-700" },
  DELIVERED:        { label: "Entregado",           dotColor: "bg-emerald-500",bgColor: "bg-emerald-50 text-emerald-700" },
  CANCELLED:        { label: "Cancelado",           dotColor: "bg-gray-500",   bgColor: "bg-gray-100 text-gray-600" },
  REJECTED:         { label: "Rechazado",           dotColor: "bg-red-500",    bgColor: "bg-red-50 text-red-700" },
};

const SOURCE_MAP: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  WHATSAPP: {
    label: "WhatsApp",
    cls: "bg-green-50 text-green-700 border-green-200",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  FACEBOOK: {
    label: "Facebook",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  INSTAGRAM: {
    label: "Instagram",
    cls: "bg-pink-50 text-pink-700 border-pink-200",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
  },
  TELEFONO: {
    label: "Teléfono",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>,
  },
  PRESENCIAL: {
    label: "Presencial",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  OTRO: {
    label: "Otro",
    cls: "bg-gray-50 text-gray-600 border-gray-200",
    icon: <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
};

export default function OrderManager({
  initialOrders,
  onRefresh,
}: {
  initialOrders: Order[];
  onRefresh?: () => void;
}) {
  const [isStatusModalOpen,   setIsStatusModalOpen]   = useState(false);
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);
  const [selectedOrder,       setSelectedOrder]       = useState<Order | null>(null);
  const [newStatus,           setNewStatus]           = useState<string>("");
  const [isLoading,           setIsLoading]           = useState(false);
  const [statusFilter,        setStatusFilter]        = useState<string>("all");

  const filteredOrders = statusFilter === "all"
    ? initialOrders
    : initialOrders.filter((o) => o.status === statusFilter);

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setIsStatusModalOpen(false);
        onRefresh?.();
      } else {
        alert("Error al actualizar estado del pedido");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 font-body pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Pedidos</h1>
            <p className="mt-1 text-sm text-gray-500">Revisa y administra todas las transacciones.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Excel export */}
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
            {/* New external order */}
            <button
              onClick={() => setIsExternalModalOpen(true)}
              className="px-4 py-2 bg-[#1C442A] text-white rounded-lg text-sm font-medium hover:bg-[#13301d] shadow-sm transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Pedido Externo
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "all" ? "bg-[#1C442A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            Todos ({initialOrders.length})
          </button>
          {Object.entries(STATUS_MAP).map(([key, val]) => {
            const count = initialOrders.filter((o) => o.status === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === key ? "bg-[#1C442A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                {val.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">N° Pedido</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Canal</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                      No hay pedidos con este filtro.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const clientName = order.customerName || order.user?.name || order.customerEmail || "Cliente";
                    const initials   = clientName.substring(0, 2).toUpperCase();
                    const status     = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
                    const src        = order.source ? SOURCE_MAP[order.source] : null;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.receiptNumber || `#ORD-${order.id.slice(0, 4).toUpperCase()}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e8f3ec] text-[#1C442A] flex items-center justify-center text-xs font-bold shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{clientName}</div>
                              <div className="text-xs text-gray-500">{order.customerEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {src ? (
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${src.cls}`}>
                              {src.icon}
                              {src.label}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Tienda Web</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          S/ {Number(order.totalAmount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.bgColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status.dotColor}`}></span>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                          <Link to={`/admin/orders/${order.id}`} className="text-sm font-medium text-[#1C442A] hover:underline">
                            Ver Detalle
                          </Link>
                          <button onClick={() => handleOpenStatusModal(order)} className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline">
                            Estado
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status modal */}
      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="Actualizar Estado de Pedido">
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              {Object.entries(STATUS_MAP).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#1C442A] hover:bg-[#13301d] rounded-lg transition-colors disabled:opacity-50">
              {isLoading ? "Guardando..." : "Actualizar Estado"}
            </button>
          </div>
        </form>
      </Modal>

      {/* External order modal */}
      <ExternalOrderModal
        isOpen={isExternalModalOpen}
        onClose={() => setIsExternalModalOpen(false)}
        onCreated={() => { onRefresh?.(); }}
      />
    </>
  );
}
