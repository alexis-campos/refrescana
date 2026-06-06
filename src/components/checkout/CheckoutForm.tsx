
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, CartItem } from "@/lib/store/useCartStore";
import { SHIPPING_ZONES, FREE_SHIPPING_MIN } from "@/lib/constants";
import { CheckoutSteps } from "./CheckoutSteps";
import { OrderSummary, getShippingCost } from "./OrderSummary";
import { YapePaymentInfo } from "./YapePaymentInfo";
import { VoucherUpload } from "./VoucherUpload";
import { OrderConfirmation } from "./OrderConfirmation";

interface OrderItemData {
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
  items: OrderItemData[];
  createdAt: string;
}

interface FormErrors {
  [key: string]: string;
}

export function CheckoutForm() {
  
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Step 1: Customer data
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerDni, setCustomerDni] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingProvince, setShippingProvince] = useState("");
  const [shippingZone, setShippingZone] = useState("");
  const [shippingNotes, setShippingNotes] = useState("");

  // Step 3: Voucher data
  const [voucherFile, setVoucherFile] = useState<File | null>(null);
  const [securityCode, setSecurityCode] = useState("");
  const [paymentTime, setPaymentTime] = useState("");

  // Step 4: Confirmation data
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Order ID from step 1 submission
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0 && currentStep < 4) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-500 mb-6">
          Agrega productos antes de continuar al checkout.
        </p>
        <Link
          to="/productos"
          className="inline-block px-6 py-3 bg-[#1C442A] text-white rounded-full font-medium hover:bg-[#13301d] transition-colors"
        >
          Ver Productos
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = getShippingCost(subtotal, shippingZone);
  const totalAmount = subtotal + shippingCost;

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!customerName.trim()) newErrors.customerName = "Nombre es requerido";
    if (!customerEmail.trim()) newErrors.customerEmail = "Email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))
      newErrors.customerEmail = "Email inválido";
    if (!customerPhone.trim())
      newErrors.customerPhone = "Teléfono es requerido";
    else if (customerPhone.replace(/\D/g, "").length < 9)
      newErrors.customerPhone = "Teléfono debe tener al menos 9 dígitos";
    if (!shippingAddress.trim())
      newErrors.shippingAddress = "Dirección es requerida";
    if (!shippingCity.trim()) newErrors.shippingCity = "Ciudad es requerida";
    if (!shippingProvince.trim())
      newErrors.shippingProvince = "Provincia es requerida";
    if (!shippingZone) newErrors.shippingZone = "Selecciona una zona de envío";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!voucherFile) newErrors.voucher = "Debes subir el comprobante de pago";
    if (!securityCode.trim())
      newErrors.securityCode = "Código de operación es requerido";
    if (!paymentTime) newErrors.paymentTime = "Hora del pago es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitStep1 = async () => {
    if (!validateStep1()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          customerDni: customerDni || undefined,
          shippingAddress,
          shippingCity,
          shippingProvince,
          shippingZone,
          shippingNotes: shippingNotes || undefined,
          shippingCost,
          items: items.map((item: CartItem) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al crear el pedido");
        return;
      }

      setOrderId(data.orderId);
      setCurrentStep(2);
    } catch {
      alert("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitStep3 = async () => {
    if (!validateStep3() || !orderId || !voucherFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", voucherFile);
      formData.append("orderId", orderId);
      formData.append("securityCode", securityCode);
      formData.append("paymentTime", paymentTime);

      const res = await fetch("/api/checkout/upload-voucher", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al subir el comprobante");
        return;
      }

      // Fetch order details for confirmation
      const orderRes = await fetch(`/api/checkout/${orderId}?email=${encodeURIComponent(customerEmail)}`);
      const orderDetails = await orderRes.json();

      setOrderData({
        orderId,
        receiptNumber: orderDetails.receiptNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerDni: customerDni || undefined,
        shippingAddress,
        shippingCity,
        shippingProvince,
        totalAmount: orderDetails.totalAmount,
        shippingCost: orderDetails.shippingCost,
        items: orderDetails.items,
        createdAt: orderDetails.createdAt,
      });

      clearCart();
      setCurrentStep(4);
    } catch {
      alert("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen">
      {/* Stepper */}
      <CheckoutSteps currentStep={currentStep} />

      <div
        className={`grid gap-8 ${currentStep === 4 ? "" : "lg:grid-cols-[1fr_360px]"}`}
      >
        {/* Main content */}
        <div>
          <AnimatePresence mode="wait">
            {/* ======== STEP 1: Customer Data ======== */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Datos de Contacto y Envío
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Ingresa tus datos para que podamos coordinar la entrega
                </p>

                <div className="space-y-5">
                  {/* Contact section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Nombre completo
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Juan Pérez"
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all ${errors.customerName ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                      />
                      {errors.customerName && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.customerName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        DNI
                        <span className="text-gray-400 ml-1 text-xs font-normal">
                          (opcional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={customerDni}
                        onChange={(e) => setCustomerDni(e.target.value)}
                        placeholder="12345678"
                        maxLength={8}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Correo electrónico
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all ${errors.customerEmail ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                      />
                      {errors.customerEmail && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.customerEmail}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Teléfono / Celular
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="987 654 321"
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all ${errors.customerPhone ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                      />
                      {errors.customerPhone && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.customerPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">
                        Dirección de Envío
                      </span>
                    </div>
                  </div>

                  {/* Shipping zone selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Zona de envío
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <select
                      value={shippingZone}
                      onChange={(e) => setShippingZone(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all appearance-none bg-white ${errors.shippingZone ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    >
                      <option value="">Selecciona tu zona</option>
                      {Object.entries(SHIPPING_ZONES).map(([key, zone]) => (
                        <option key={key} value={key}>
                          {zone.label} — S/ {zone.cost.toFixed(2)}
                        </option>
                      ))}
                    </select>
                    {errors.shippingZone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shippingZone}
                      </p>
                    )}
                    {shippingZone && subtotal >= FREE_SHIPPING_MIN && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          ¡Envío gratis aplicado! (Compra mayor a S/{" "}
                          {FREE_SHIPPING_MIN.toFixed(2)})
                        </span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Dirección completa
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Av. Principal 123, Urb. Los Jardines"
                      className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all ${errors.shippingAddress ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                    />
                    {errors.shippingAddress && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.shippingAddress}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Ciudad
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        placeholder="Huánuco"
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all ${errors.shippingCity ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                      />
                      {errors.shippingCity && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.shippingCity}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Departamento / Provincia
                        <span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        value={shippingProvince}
                        onChange={(e) => setShippingProvince(e.target.value)}
                        placeholder="Huánuco"
                        className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all ${errors.shippingProvince ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                      />
                      {errors.shippingProvince && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.shippingProvince}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Notas de envío
                      <span className="text-gray-400 ml-1 text-xs font-normal">
                        (opcional)
                      </span>
                    </label>
                    <textarea
                      value={shippingNotes}
                      onChange={(e) => setShippingNotes(e.target.value)}
                      placeholder="Referencias, entre calles, piso, número de departamento..."
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C442A]/20 focus:border-[#1C442A] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-8">
                  <button
                    onClick={handleSubmitStep1}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#1C442A] text-white rounded-full font-bold text-lg hover:bg-[#13301d] transition-colors shadow-lg shadow-[#1C442A]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      <>
                        Continuar al Pago
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
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======== STEP 2: Yape Payment Info ======== */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
              >
                <YapePaymentInfo totalAmount={totalAmount} />

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-full font-medium hover:bg-gray-200 transition-colors"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3 bg-[#7b2d8e] text-white rounded-full font-bold text-lg hover:bg-[#6b2080] transition-colors shadow-lg shadow-[#7b2d8e]/20"
                  >
                    Ya pagué, subir comprobante →
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======== STEP 3: Upload Voucher ======== */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
              >
                <VoucherUpload
                  onUpload={setVoucherFile}
                  securityCode={securityCode}
                  onSecurityCodeChange={setSecurityCode}
                  paymentTime={paymentTime}
                  onPaymentTimeChange={setPaymentTime}
                />

                {/* Errors */}
                {Object.keys(errors).length > 0 && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                    {Object.values(errors).map((error, i) => (
                      <p key={i} className="text-sm text-red-600">
                        • {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-full font-medium hover:bg-gray-200 transition-colors"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={handleSubmitStep3}
                    disabled={isLoading}
                    className="flex-1 py-3 bg-[#1C442A] text-white rounded-full font-bold text-lg hover:bg-[#13301d] transition-colors shadow-lg shadow-[#1C442A]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <span className="flex items-center gap-2">
                        Confirmar Pedido
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======== STEP 4: Confirmation ======== */}
            {currentStep === 4 && orderData && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
              >
                <OrderConfirmation orderData={orderData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Order Summary (hidden on step 4) */}
        {currentStep < 4 && (
          <div className="lg:sticky lg:top-28 h-fit">
            <OrderSummary shippingZone={shippingZone} />
          </div>
        )}
      </div>
    </div>
  );
}
