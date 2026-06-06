import { jsPDF } from "jspdf";
import { SITE_NAME, SITE_LEGAL_NAME, SITE_RUC, CONTACT } from "@/lib/constants";

interface ReceiptItem {
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface ReceiptData {
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
  items: ReceiptItem[];
  createdAt: string;
}

export async function generateReceipt(data: ReceiptData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Colors
  const primary = [28, 68, 42] as const; // #1C442A
  const muted = [100, 116, 107] as const;
  const divider = [230, 235, 232] as const;

  // ======== HEADER ========
  doc.setFillColor(...primary);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(SITE_NAME.toUpperCase(), margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(SITE_LEGAL_NAME, margin, 25);
  doc.text(`RUC: ${SITE_RUC}`, margin, 30);
  doc.text(`Tel: ${CONTACT.phones[0]} | Email: ${CONTACT.email}`, margin, 35);

  // Receipt number on the right
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("BOLETA DE VENTA", pageWidth - margin, 18, { align: "right" });
  doc.setFontSize(14);
  doc.text(data.receiptNumber, pageWidth - margin, 27, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const date = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
  doc.text(date, pageWidth - margin, 33, { align: "right" });

  y = 50;

  // ======== CLIENT INFO ========
  doc.setTextColor(...primary);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE", margin, y);
  y += 2;

  doc.setDrawColor(...divider);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const clientInfo = [
    ["Nombre:", data.customerName],
    ["Email:", data.customerEmail],
    ["Teléfono:", data.customerPhone],
  ];

  if (data.customerDni) {
    clientInfo.push(["DNI:", data.customerDni]);
  }

  clientInfo.push([
    "Dirección:",
    `${data.shippingAddress}, ${data.shippingCity}, ${data.shippingProvince}`,
  ]);

  clientInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 25, y);
    y += 5;
  });

  y += 5;

  // ======== TABLE HEADER ========
  doc.setFillColor(245, 247, 246);
  doc.rect(margin, y - 4, contentWidth, 8, "F");

  doc.setTextColor(...primary);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");

  const col1 = margin + 2;
  const col2 = margin + 90;
  const col3 = margin + 110;
  const col4 = margin + 135;

  doc.text("PRODUCTO", col1, y);
  doc.text("CANT.", col2, y);
  doc.text("P. UNIT.", col3, y);
  doc.text("SUBTOTAL", col4, y);

  y += 6;
  doc.setDrawColor(...divider);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // ======== TABLE BODY ========
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  let itemSubtotal = 0;

  data.items.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    itemSubtotal += lineTotal;

    // Truncate long product names
    const maxNameLength = 45;
    const name =
      item.product.name.length > maxNameLength
        ? item.product.name.substring(0, maxNameLength) + "..."
        : item.product.name;

    doc.text(name, col1, y);
    doc.text(String(item.quantity), col2, y);
    doc.text(`S/ ${item.price.toFixed(2)}`, col3, y);
    doc.setFont("helvetica", "bold");
    doc.text(`S/ ${lineTotal.toFixed(2)}`, col4, y);
    doc.setFont("helvetica", "normal");
    y += 6;
  });

  y += 2;
  doc.setDrawColor(...divider);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // ======== TOTALS ========
  const totalsX = margin + 100;
  const totalsValueX = col4;

  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", totalsX, y);
  doc.text(`S/ ${itemSubtotal.toFixed(2)}`, totalsValueX, y);
  y += 5;

  doc.text("Envío:", totalsX, y);
  doc.text(
    data.shippingCost === 0
      ? "Gratis"
      : `S/ ${data.shippingCost.toFixed(2)}`,
    totalsValueX,
    y
  );
  y += 3;
  doc.line(totalsX, y, pageWidth - margin, y);
  y += 6;

  doc.setTextColor(...primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL:", totalsX, y);
  doc.text(`S/ ${data.totalAmount.toFixed(2)}`, totalsValueX, y);

  y += 12;

  // ======== FOOTER ========
  doc.setDrawColor(...divider);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setTextColor(...muted);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Este documento es un comprobante de venta interno emitido por " +
      SITE_LEGAL_NAME +
      ".",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 4;
  doc.text(
    "Para cualquier consulta, contáctenos al " +
      CONTACT.phones[0] +
      " o " +
      CONTACT.email,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 4;
  doc.text("¡Gracias por tu compra!", pageWidth / 2, y, {
    align: "center",
  });

  // Save
  doc.save(`Boleta-${data.receiptNumber}.pdf`);
}
