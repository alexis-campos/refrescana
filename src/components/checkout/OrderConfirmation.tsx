
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from '@/components/ui/NavLink';
import { generateReceipt } from "@/lib/generateReceipt";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface OrderData {
  orderId: string;
  receiptNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDni?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  totalAmount: number;
  shippingCost: number;
  items: OrderItem[];
  createdAt: string;
}

interface OrderConfirmationProps {
  orderData: OrderData;
}

export function OrderConfirmation({ orderData }: OrderConfirmationProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      await generateReceipt(orderData);
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Error al generar la boleta. Inténtalo de nuevo.");
    } finally {
      setIsDownloading(false);
    }
  };

  const subtotal = orderData.totalAmount - orderData.shippingCost;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center space-y-6"
    >
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                y: -20,
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                rotate: 0,
              }}
              animate={{
                opacity: 0,
                y: typeof window !== "undefined" ? window.innerHeight + 100 : 1000,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeIn",
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: [
                  "#1C442A",
                  "#7b2d8e",
                  "#CCA33D",
                  "#2E6842",
                  "#f59e0b",
                  "#ec4899",
                ][i % 6],
              }}
            />
          ))}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          ¡Pedido Registrado!
        </h2>
        <p className="text-gray-500 mt-2">
          Tu comprobante ha sido enviado. Verificaremos tu pago y te
          contactaremos pronto.
        </p>
      </div>

      {/* Order info card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left shadow-sm max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              N° de Pedido
            </p>
            <p className="text-lg font-bold text-[#1C442A]">
              {orderData.receiptNumber}
            </p>
          </div>
          <div className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200">
            Verificando pago
          </div>
        </div>

        {/* Items summary */}
        <div className="space-y-2 mb-4">
          {orderData.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
            >
              <span className="text-gray-600">
                {item.product.name} x{item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                S/ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Envío</span>
            <span>
              {orderData.shippingCost === 0
                ? "Gratis"
                : `S/ ${orderData.shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-50">
            <span>Total</span>
            <span className="text-[#1C442A]">
              S/ {orderData.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 space-y-1">
          <p>
            <strong>Envío a:</strong> {orderData.shippingAddress},{" "}
            {orderData.shippingCity}, {orderData.shippingProvince}
          </p>
          <p>
            <strong>Contacto:</strong> {orderData.customerEmail}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        <button
          onClick={handleDownloadReceipt}
          disabled={isDownloading}
          className="flex-1 px-6 py-3 bg-[#1C442A] text-white rounded-full font-medium hover:bg-[#13301d] transition-colors shadow-lg shadow-[#1C442A]/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {isDownloading ? "Generando..." : "Descargar Boleta"}
        </button>
        <Link
          href="/productos"
          className="flex-1 px-6 py-3 bg-white text-[#1C442A] border border-[#1C442A] rounded-full font-medium hover:bg-green-50 transition-colors text-center"
        >
          Seguir Comprando
        </Link>
      </div>

      {/* Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-md mx-auto">
        <p className="text-xs text-blue-700">
          <strong>Nota:</strong> Tu pedido será confirmado una vez que
          verifiquemos el pago de Yape. Te contactaremos por email o teléfono
          para coordinar el envío.
        </p>
      </div>
    </motion.div>
  );
}
