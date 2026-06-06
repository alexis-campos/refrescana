
import { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/lib/api/endpoints";
import type { Product } from "@/types/api";

interface ItemRow {
  productId: string;
  productName: string;
  quantity: number;
  price: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  WHATSAPP: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  FACEBOOK: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  INSTAGRAM: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  TELEFONO: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
    </svg>
  ),
  PRESENCIAL: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  OTRO: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

const SOURCES = [
  { value: "WHATSAPP",   label: "WhatsApp"   },
  { value: "FACEBOOK",   label: "Facebook"   },
  { value: "INSTAGRAM",  label: "Instagram"  },
  { value: "TELEFONO",   label: "Teléfono"   },
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "OTRO",       label: "Otro"       },
];

const STATUS_OPTIONS = [
  { value: "PENDING",          label: "Pendiente" },
  { value: "PAYMENT_UPLOADED", label: "Comprobante Enviado" },
  { value: "PAID",             label: "Pagado" },
];

const empty = () => ({
  source: "WHATSAPP",
  status: "PENDING",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerDni: "",
  shippingAddress: "",
  shippingCity: "",
  shippingProvince: "",
  shippingNotes: "",
  shippingCost: "0",
  yapeSecurityCode: "",
  yapePaymentTime: "",
});

export function ExternalOrderModal({ isOpen, onClose, onCreated }: Props) {
  const [form, setForm] = useState(empty());
  const [items, setItems] = useState<ItemRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      api.admin.products.list().then(setProducts).catch(() => {});
    }
  }, [isOpen]);

  const reset = () => {
    setForm(empty());
    setItems([]);
    setVoucherFile(null);
    setVoucherPreview(null);
    setError(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const addItem = () => {
    if (products.length === 0) return;
    const p = products[0];
    setItems((prev) => [...prev, { productId: p.id, productName: p.name, quantity: 1, price: String(p.price) }]);
  };

  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const updateItem = (idx: number, field: keyof ItemRow, val: string | number) =>
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, [field]: val } : it));

  const onProductChange = (idx: number, productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    setItems((prev) => prev.map((it, i) =>
      i === idx ? { ...it, productId: p.id, productName: p.name, price: String(p.price) } : it
    ));
  };

  const handleVoucher = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setVoucherFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setVoucherPreview(url);
    } else {
      setVoucherPreview(null);
    }
  };

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.price) || 0) * it.quantity, 0);
  const shipping = parseFloat(form.shippingCost) || 0;
  const total    = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) { setError("Agrega al menos un producto."); return; }
    if (!form.customerName || !form.customerEmail || !form.customerPhone) {
      setError("Nombre, email y teléfono del cliente son obligatorios."); return;
    }
    if (!form.shippingAddress || !form.shippingCity || !form.shippingProvince) {
      setError("Dirección, ciudad y provincia son obligatorias."); return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("items", JSON.stringify(items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        price: parseFloat(it.price) || 0,
      }))));
      if (voucherFile) fd.append("voucher", voucherFile);

      await api.admin.orders.createExternal(fd);
      reset();
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C442A]/30 focus:border-[#1C442A] transition-colors";
  const labelCls = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Pedido Externo" maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Canal & Estado ─────────────────────────────────────── */}
        <div className="bg-[#f8fdf9] border border-[#d8edd8] rounded-xl p-4 space-y-4">
          <p className="text-xs font-bold text-[#1C442A] uppercase tracking-wider">Canal de origen</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SOURCES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => set("source", s.value)}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg border text-xs font-medium transition-all ${
                  form.source === s.value
                    ? "border-[#1C442A] bg-[#1C442A] text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-[#1C442A]/40 hover:text-[#1C442A]"
                }`}
              >
                {SOURCE_ICONS[s.value]}
                {s.label}
              </button>
            ))}
          </div>
          <div>
            <label className={labelCls}>Estado inicial del pedido</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Datos del cliente ──────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Datos del Cliente</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Nombre completo *</label>
              <input required value={form.customerName} onChange={(e) => set("customerName", e.target.value)} className={inputCls} placeholder="Ej. Juan Pérez" />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input required type="email" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} className={inputCls} placeholder="cliente@email.com" />
            </div>
            <div>
              <label className={labelCls}>Teléfono *</label>
              <input required value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} className={inputCls} placeholder="999 999 999" />
            </div>
            <div>
              <label className={labelCls}>DNI (opcional)</label>
              <input value={form.customerDni} onChange={(e) => set("customerDni", e.target.value)} className={inputCls} placeholder="12345678" />
            </div>
          </div>
        </div>

        {/* ── Dirección de envío ─────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección de Envío</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={labelCls}>Dirección *</label>
              <input required value={form.shippingAddress} onChange={(e) => set("shippingAddress", e.target.value)} className={inputCls} placeholder="Av. Principal 123, Dpto 4B" />
            </div>
            <div>
              <label className={labelCls}>Ciudad *</label>
              <input required value={form.shippingCity} onChange={(e) => set("shippingCity", e.target.value)} className={inputCls} placeholder="Lima" />
            </div>
            <div>
              <label className={labelCls}>Provincia *</label>
              <input required value={form.shippingProvince} onChange={(e) => set("shippingProvince", e.target.value)} className={inputCls} placeholder="Lima" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Notas de envío (opcional)</label>
              <input value={form.shippingNotes} onChange={(e) => set("shippingNotes", e.target.value)} className={inputCls} placeholder="Referencia, instrucciones de entrega..." />
            </div>
          </div>
        </div>

        {/* ── Productos ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Productos</p>
            <button
              type="button"
              onClick={addItem}
              disabled={products.length === 0}
              className="text-xs font-medium text-[#1C442A] hover:underline disabled:opacity-40"
            >
              + Agregar producto
            </button>
          </div>

          {items.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl py-6 text-center">
              <p className="text-sm text-gray-400">Aún no hay productos. Haz click en "Agregar producto".</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center">
                  <select
                    value={item.productId}
                    onChange={(e) => onProductChange(idx, e.target.value)}
                    className={inputCls}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                    className={inputCls + " text-center"}
                    placeholder="Cant."
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">S/</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(idx, "price", e.target.value)}
                      className={inputCls + " pl-7"}
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Totales */}
          <div className="mt-2 pt-3 border-t border-gray-100 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal productos</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 gap-3">
              <span className="shrink-0">Costo de envío (S/)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.shippingCost}
                onChange={(e) => set("shippingCost", e.target.value)}
                className="w-28 px-2 py-1 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-1 focus:ring-[#1C442A]/30"
                placeholder="0.00"
              />
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#1C442A]">S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── Comprobante de pago (opcional) ────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Comprobante de Pago (opcional)</p>
          <div
            className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#1C442A]/40 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {voucherPreview ? (
              <img src={voucherPreview} alt="Vista previa" className="max-h-48 mx-auto rounded-lg object-contain" />
            ) : (
              <div className="py-4">
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-400">Click para subir imagen (JPG, PNG, WebP · máx. 5 MB)</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleVoucher} />
          </div>

          {voucherFile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Código de operación (Yape)</label>
                <input value={form.yapeSecurityCode} onChange={(e) => set("yapeSecurityCode", e.target.value)} className={inputCls} placeholder="Ej. 123456" />
              </div>
              <div>
                <label className={labelCls}>Hora del pago</label>
                <input value={form.yapePaymentTime} onChange={(e) => set("yapePaymentTime", e.target.value)} className={inputCls} placeholder="Ej. 14:35" />
              </div>
            </div>
          )}
        </div>

        {/* ── Error & Acciones ───────────────────────────────────── */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-[#1C442A] hover:bg-[#13301d] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Registrar Pedido
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
