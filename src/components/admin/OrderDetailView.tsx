
import { useState } from "react";

import { Link } from 'react-router-dom';
import { Modal } from "@/components/ui/Modal";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
    categoryName: string;
    price: number;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDni: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingDistrict: string | null;
  shippingNotes: string | null;
  shippingCost: number;
  yapeVoucherUrl: string | null;
  yapeSecurityCode: string | null;
  yapePaymentTime: string | null;
  receiptNumber: string | null;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
  user?: { name: string | null; email: string | null } | null;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pendiente", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  PAYMENT_UPLOADED: { label: "Comprobante Enviado", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  PAID: { label: "Pagado", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  PREPARING: { label: "En Preparación", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  SHIPPED: { label: "Enviado", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
  DELIVERED: { label: "Entregado", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  CANCELLED: { label: "Cancelado", color: "text-gray-700", bg: "bg-gray-100 border-gray-300" },
  REJECTED: { label: "Rechazado", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export function OrderDetailView({ order, onRefresh }: { order: Order; onRefresh?: () => void }) {

  const [isUpdating, setIsUpdating] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
  const subtotal = order.totalAmount - order.shippingCost;

  const rawVoucherUrl = order.yapeVoucherUrl;
  // PHP backend serves files directly via Apache at /uploads/...
  // Vite proxy forwards /uploads/* → XAMPP, so no rewriting needed.
  const voucherUrl = rawVoucherUrl
    ? rawVoucherUrl.startsWith('http')
      ? rawVoucherUrl
      : rawVoucherUrl.startsWith('/uploads/')
        ? rawVoucherUrl                         // ✓ Already correct: /uploads/yape/xxx.png
        : `/uploads/yape/${rawVoucherUrl}`      // Bare filename fallback
    : null;

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setShowStatusModal(false);
        onRefresh?.();
      } else {
        alert("Error al actualizar el estado");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="space-y-6 font-body pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <Link to="/admin/orders" className="text-sm text-gray-500 hover:text-[#1C442A] transition-colors mb-2 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              Volver a Pedidos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Pedido {order.receiptNumber || `#${order.id.slice(0, 8).toUpperCase()}`}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <button onClick={() => setShowStatusModal(true)} className="px-4 py-2 bg-[#1C442A] text-white rounded-lg text-sm font-medium hover:bg-[#13301d] transition-colors">
              Cambiar Estado
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer info */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#e8f3ec] text-[#1C442A] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                Información del Cliente
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500">Nombre</p><p className="font-medium text-gray-900">{order.customerName}</p></div>
                <div><p className="text-gray-500">Email</p><p className="font-medium text-gray-900">{order.customerEmail}</p></div>
                <div><p className="text-gray-500">Teléfono</p><p className="font-medium text-gray-900">{order.customerPhone}</p></div>
                {order.customerDni && <div><p className="text-gray-500">DNI</p><p className="font-medium text-gray-900">{order.customerDni}</p></div>}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <a href={`https://wa.me/51${order.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${order.customerName}, sobre tu pedido ${order.receiptNumber} en Refrescaña...`)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp
                </a>
                <a href={`mailto:${order.customerEmail}?subject=Pedido ${order.receiptNumber} - Refrescaña`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Email
                </a>
              </div>
            </div>

            {/* Shipping info */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#e8f3ec] text-[#1C442A] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </span>
                Dirección de Envío
              </h3>
              <div className="text-sm space-y-2">
                <p className="font-medium text-gray-900">{order.shippingAddress}</p>
                <p className="text-gray-600">{order.shippingCity}, {order.shippingProvince}</p>
                {order.shippingNotes && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs font-medium text-amber-700 mb-1">Notas de envío:</p>
                    <p className="text-sm text-amber-900">{order.shippingNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order items */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#e8f3ec] text-[#1C442A] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </span>
                Productos ({order.items.length})
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.product.categoryName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{item.quantity} × S/ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Envío</span><span>{order.shippingCost === 0 ? "Gratis" : `S/ ${order.shippingCost.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span className="text-[#1C442A]">S/ {order.totalAmount.toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          {/* Right column — Yape Voucher */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-2 border-[#7b2d8e]/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#f3e8fa] text-[#7b2d8e] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>
                </span>
                Comprobante Yape
              </h3>
              {voucherUrl ? (
                <div className="space-y-4">
                  <div className="cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:border-[#7b2d8e] transition-colors" onClick={() => setShowImageModal(true)}>
                    <img src={voucherUrl} alt="Comprobante de Yape" className="w-full object-contain max-h-[400px]" />
                  </div>
                  <p className="text-xs text-center text-gray-500">Click para ampliar</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Código de operación</span>
                      <span className="font-bold text-gray-900 font-mono">{order.yapeSecurityCode || "—"}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Hora del pago</span>
                      <span className="font-bold text-gray-900">{order.yapePaymentTime || "—"}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">Monto reportado</span>
                      <span className="font-bold text-[#1C442A]">S/ {order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="text-sm text-gray-500">No se ha subido comprobante aún</p>
                </div>
              )}
            </div>

      {/* Quick actions */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-6 space-y-3">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Acciones Rápidas</h3>
              {order.status === "PAYMENT_UPLOADED" && (
                <>
                  <button onClick={() => { setNewStatus("PAID"); setShowStatusModal(true); }} className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Confirmar Pago
                  </button>
                  <button onClick={() => { setNewStatus("REJECTED"); setShowStatusModal(true); }} className="w-full py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    Rechazar Pago
                  </button>
                </>
              )}
              {order.status === "PAID" && (
                <button onClick={() => { setNewStatus("PREPARING"); setShowStatusModal(true); }} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Marcar En Preparación
                </button>
              )}
              {order.status === "PREPARING" && (
                <button onClick={() => { setNewStatus("SHIPPED"); setShowStatusModal(true); }} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  Marcar como Enviado
                </button>
              )}
              {order.status === "SHIPPED" && (
                <button onClick={() => { setNewStatus("DELIVERED"); setShowStatusModal(true); }} className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Marcar como Entregado
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image modal */}
      <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)} title="Comprobante de Yape" maxWidth="max-w-2xl">
        {voucherUrl && (
          <img src={voucherUrl} alt="Comprobante Yape" className="w-full rounded-lg" />
        )}
      </Modal>

      {/* Status modal */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Cambiar Estado del Pedido">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              {Object.entries(STATUS_MAP).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
            <button onClick={handleUpdateStatus} disabled={isUpdating} className="px-4 py-2 text-sm font-medium text-white bg-[#1C442A] hover:bg-[#13301d] rounded-lg transition-colors disabled:opacity-50">
              {isUpdating ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
