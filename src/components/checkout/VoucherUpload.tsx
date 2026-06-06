
import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";

interface VoucherUploadProps {
  onUpload: (file: File) => void;
  securityCode: string;
  onSecurityCodeChange: (code: string) => void;
  paymentTime: string;
  onPaymentTimeChange: (time: string) => void;
}

export function VoucherUpload({
  onUpload,
  securityCode,
  onSecurityCodeChange,
  paymentTime,
  onPaymentTimeChange,
}: VoucherUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar los 5MB");
        return;
      }

      setFileName(file.name);
      onUpload(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    setPreview(null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-2">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Sube tu comprobante de Yape
        </h3>
        <p className="text-sm text-gray-500">
          Adjunta la captura de pantalla de tu pago completado
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-[#7b2d8e] bg-[#f8f0fa]"
            : preview
              ? "border-green-300 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-[#7b2d8e] hover:bg-[#faf5fc]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-3">
            <div className="relative w-48 mx-auto">
              <img
                src={preview}
                alt="Comprobante"
                className="w-full rounded-lg shadow-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              {fileName}
            </p>
            <p className="text-xs text-gray-500">
              Click para cambiar la imagen
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg
                className="w-8 h-8 text-[#7b2d8e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Arrastra tu captura aquí o{" "}
                <span className="text-[#7b2d8e] underline">busca archivo</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG o WebP • Máximo 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security Code */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Código de operación
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="text"
          value={securityCode}
          onChange={(e) => onSecurityCodeChange(e.target.value)}
          placeholder="Ej: 843291"
          maxLength={10}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7b2d8e]/30 focus:border-[#7b2d8e] transition-all text-lg tracking-wider font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">
          Aparece en tu comprobante de Yape como &quot;N° de operación&quot;
        </p>
      </div>

      {/* Payment Time */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Hora del pago
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="time"
          value={paymentTime}
          onChange={(e) => onPaymentTimeChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7b2d8e]/30 focus:border-[#7b2d8e] transition-all"
        />
        <p className="text-xs text-gray-500 mt-1">
          Hora en la que realizaste la transferencia
        </p>
      </div>
    </motion.div>
  );
}
