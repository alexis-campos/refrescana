
import { useCartStore, CartItem } from "@/lib/store/useCartStore";
import { SHIPPING_ZONES, FREE_SHIPPING_MIN } from "@/lib/constants";

interface OrderSummaryProps {
  shippingZone: string;
  compact?: boolean;
}

export function OrderSummary({ shippingZone, compact = false }: OrderSummaryProps) {
  const items = useCartStore((state) => state.items);

  const subtotal = items.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0
  );

  const shippingCost = getShippingCost(subtotal, shippingZone);
  const total = subtotal + shippingCost;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${compact ? "p-4" : "p-6"}`}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Resumen del Pedido
      </h3>

      {/* Products */}
      <div className="space-y-3 mb-4">
        {items.map((item: CartItem) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 shrink-0">
              S/ {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Envío</span>
          {shippingZone ? (
            shippingCost === 0 ? (
              <span className="text-green-600 font-medium">¡Gratis!</span>
            ) : (
              <span>S/ {shippingCost.toFixed(2)}</span>
            )
          ) : (
            <span className="text-gray-400 italic">Selecciona zona</span>
          )}
        </div>
        {subtotal > 0 && subtotal < FREE_SHIPPING_MIN && (
          <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            ¡Envío gratis en compras desde S/ {FREE_SHIPPING_MIN.toFixed(2)}!
          </p>
        )}
        <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
          <span>Total</span>
          <span className="text-[#1C442A]">S/ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export function getShippingCost(
  subtotal: number,
  shippingZone: string
): number {
  if (subtotal >= FREE_SHIPPING_MIN) return 0;
  const zone = SHIPPING_ZONES[shippingZone];
  return zone ? zone.cost : 0;
}
