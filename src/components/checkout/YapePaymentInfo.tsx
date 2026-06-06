
import { motion } from "framer-motion";
import { YAPE_CONFIG } from "@/lib/constants";
import { useState } from "react";

interface YapePaymentInfoProps {
  totalAmount: number;
}

export function YapePaymentInfo({ totalAmount }: YapePaymentInfoProps) {
  const [copied, setCopied] = useState(false);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(YAPE_CONFIG.phone.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Yape branded header */}
      <div className="bg-gradient-to-br from-[#7b2d8e] to-[#6b2080] rounded-2xl p-6 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg>
          </div>
          <h3 className="text-2xl font-bold">Pago con Yape</h3>
        </div>
        <p className="text-white/80 text-sm">
          Realiza la transferencia al siguiente número
        </p>
      </div>

      {/* Amount to pay */}
      <div className="bg-[#f8f0fa] border-2 border-[#7b2d8e]/20 rounded-2xl p-5 text-center">
        <p className="text-sm text-gray-600 mb-1">Monto a transferir</p>
        <p className="text-4xl font-bold text-[#7b2d8e]">
          S/ {totalAmount.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Incluye envío
        </p>
      </div>

      {/* Phone number */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-sm text-gray-500 mb-2 text-center">
          Número de Yape
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl font-bold text-gray-900 tracking-wider font-mono">
            {YAPE_CONFIG.phone}
          </span>
          <button
            onClick={copyPhone}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Copiado
              </span>
            ) : "Copiar"}
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          A nombre de: <strong className="text-gray-700">{YAPE_CONFIG.holderName}</strong>
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
        <p className="text-sm text-gray-500 mb-3">O escanea el QR</p>
        <div className="w-48 h-48 mx-auto bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={YAPE_CONFIG.qrImage}
            alt="QR de Yape"
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<div class="text-center text-gray-400"><svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg><p class="text-sm">QR no disponible</p></div>';
            }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Instrucciones
        </h4>
        <ol className="space-y-2 text-sm text-amber-900">
          <li className="flex gap-2">
            <span className="font-bold text-[#7b2d8e] shrink-0">1.</span>
            Abre tu app de Yape y yapea al número indicado
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#7b2d8e] shrink-0">2.</span>
            Ingresa el monto exacto: <strong>S/ {totalAmount.toFixed(2)}</strong>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#7b2d8e] shrink-0">3.</span>
            Toma una captura de pantalla del comprobante
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#7b2d8e] shrink-0">4.</span>
            Haz click en <strong>Continuar</strong> para subir tu comprobante
          </li>
        </ol>
      </div>
    </motion.div>
  );
}
