import { WorkReport } from "@/types";

export const IBERSOFT_BRAND = {
  name: "Ibersoft",
  legalName: "Ibersoft Servicios IT",
  email: "administracion@ibersoft.es",
  website: "www.ibersoft.es",
  hourlyRate: 50
};

const PDF_COLORS = {
  ink: [15, 23, 42] as const,
  body: [51, 65, 85] as const,
  muted: [100, 116, 139] as const,
  line: [203, 213, 225] as const,
  panel: [248, 250, 252] as const,
  primary: [14, 165, 233] as const,
  accent: [45, 212, 191] as const
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}

function formatSignedDate(value: string | null) {
  if (!value) return "Pendiente";

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function drawHeader(pdf: any, title: string, subtitle: string) {
  pdf.setFillColor(...PDF_COLORS.ink);
  pdf.rect(0, 0, 210, 38, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text(IBERSOFT_BRAND.name, 14, 18);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(IBERSOFT_BRAND.legalName, 14, 25);
  pdf.text(subtitle, 14, 31);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(title, 196, 18, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(IBERSOFT_BRAND.email, 196, 25, { align: "right" });
  pdf.text(IBERSOFT_BRAND.website, 196, 31, { align: "right" });
}

function drawMetricCard(pdf: any, x: number, y: number, label: string, value: string) {
  pdf.setFillColor(...PDF_COLORS.panel);
  pdf.setDrawColor(...PDF_COLORS.line);
  pdf.roundedRect(x, y, 56, 26, 5, 5, "FD");
  pdf.setTextColor(...PDF_COLORS.muted);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(label, x + 4, y + 8);
  pdf.setTextColor(...PDF_COLORS.ink);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(value, x + 4, y + 18);
}

function drawSectionTitle(pdf: any, title: string, y: number) {
  pdf.setTextColor(...PDF_COLORS.ink);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(title, 14, y);
  pdf.setDrawColor(...PDF_COLORS.line);
  pdf.line(14, y + 3, 196, y + 3);
}

function drawLabeledRows(pdf: any, rows: Array<[string, string]>, startY: number, splitX = 96) {
  rows.forEach(([label, value], index) => {
    const y = startY + index * 8;
    pdf.setTextColor(...PDF_COLORS.muted);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(label, 14, y);
    pdf.setTextColor(...PDF_COLORS.ink);
    pdf.text(value, splitX, y);
  });
}

function drawFooter(pdf: any, pageLabel: string) {
  pdf.setDrawColor(...PDF_COLORS.line);
  pdf.line(14, 286, 196, 286);
  pdf.setTextColor(...PDF_COLORS.muted);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text("WorkingParts · Operativa tecnica y trazabilidad documental", 14, 292);
  pdf.text(pageLabel, 196, 292, { align: "right" });
}

export async function buildExcelWorkbook(data: WorkReport[]) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = IBERSOFT_BRAND.name;
  workbook.subject = "Resumen de partes tecnicos";
  workbook.company = IBERSOFT_BRAND.legalName;

  const sheet = workbook.addWorksheet("Partes");
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.columns = [
    { header: "Parte", key: "id", width: 18 },
    { header: "Fecha", key: "date", width: 14 },
    { header: "Tecnico", key: "technician", width: 24 },
    { header: "Cliente", key: "client", width: 24 },
    { header: "Categoria", key: "category", width: 22 },
    { header: "Estado", key: "status", width: 18 },
    { header: "Duracion", key: "durationHours", width: 14 },
    { header: "Importe", key: "totalAmount", width: 16 }
  ];

  data.forEach((report) =>
    sheet.addRow({
      ...report,
      totalAmount: report.durationHours * report.hourlyRate
    })
  );

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFF8FAFC" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  header.alignment = { vertical: "middle", horizontal: "center" };
  header.height = 24;

  sheet.eachRow((row, index) => {
    if (index === 1) return;

    row.height = 22;
    row.alignment = { vertical: "middle" };
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } }
      };
    });

    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
      });
    }
  });

  return workbook;
}

export async function buildPdfSummary(data: WorkReport[]) {
  const jsPDF = (await import("jspdf")).default;
  const pdf = new jsPDF();
  const totalHours = data.reduce((sum, report) => sum + report.durationHours, 0);
  const totalBilling = data.reduce((sum, report) => sum + report.durationHours * report.hourlyRate, 0);
  const signedCount = data.filter((report) => report.hasSignature || report.clientSignatureDataUrl).length;

  drawHeader(pdf, "Resumen de partes", "Documento ejecutivo para supervision y control");

  drawMetricCard(pdf, 14, 48, "Partes", `${data.length}`);
  drawMetricCard(pdf, 76, 48, "Horas", `${totalHours.toFixed(1)} h`);
  drawMetricCard(pdf, 138, 48, "Facturacion", formatCurrency(totalBilling));

  drawMetricCard(pdf, 14, 80, "Firmas", `${signedCount}`);
  drawMetricCard(pdf, 76, 80, "Pendientes", `${data.filter((item) => item.status === "Pendiente").length}`);
  drawMetricCard(pdf, 138, 80, "Media", data.length ? `${(totalHours / data.length).toFixed(1)} h` : "0 h");

  drawSectionTitle(pdf, "Detalle operativo", 118);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...PDF_COLORS.muted);
  pdf.text("Parte", 14, 126);
  pdf.text("Cliente", 44, 126);
  pdf.text("Estado", 108, 126);
  pdf.text("Horas", 146, 126);
  pdf.text("Importe", 196, 126, { align: "right" });

  let currentY = 134;
  data.slice(0, 9).forEach((report, index) => {
    pdf.setFillColor(index % 2 === 0 ? 248 : 255, 250, 252);
    pdf.roundedRect(14, currentY - 6, 182, 12, 2, 2, "F");
    pdf.setTextColor(...PDF_COLORS.ink);
    pdf.setFont("helvetica", "normal");
    pdf.text(report.id, 16, currentY);
    pdf.text(report.client.slice(0, 30), 44, currentY);
    pdf.text(report.status, 108, currentY);
    pdf.text(`${report.durationHours.toFixed(1)} h`, 146, currentY);
    pdf.text(formatCurrency(report.durationHours * report.hourlyRate), 194, currentY, { align: "right" });
    currentY += 14;
  });

  drawSectionTitle(pdf, "Observaciones", 266);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...PDF_COLORS.body);
  pdf.text(
    "Resumen generado desde WorkingParts para seguimiento interno, actividad tecnica y control de facturacion.",
    14,
    274,
    { maxWidth: 182 }
  );

  drawFooter(pdf, "Resumen operativo");
  return pdf;
}

export async function buildReportInvoicePdf(report: WorkReport) {
  const jsPDF = (await import("jspdf")).default;
  const pdf = new jsPDF();
  const totalAmount = report.durationHours * report.hourlyRate;

  drawHeader(pdf, "Factura de servicio", "Parte tecnico con detalle documental y conformidad");

  drawMetricCard(pdf, 14, 48, "Parte", report.id);
  drawMetricCard(pdf, 76, 48, "Fecha", report.date);
  drawMetricCard(pdf, 138, 48, "Total", formatCurrency(totalAmount));

  drawSectionTitle(pdf, "Datos del servicio", 88);
  drawLabeledRows(
    pdf,
    [
      ["Cliente", report.client],
      ["Empresa", report.company],
      ["Contacto", report.contact],
      ["Tecnico", report.technician],
      ["Categoria", report.category],
      ["Horario", `${report.startTime} - ${report.endTime}`],
      ["Prioridad", report.priority],
      ["Estado", report.status]
    ],
    98
  );

  drawSectionTitle(pdf, "Concepto facturable", 166);
  pdf.setFillColor(...PDF_COLORS.panel);
  pdf.roundedRect(14, 174, 182, 28, 4, 4, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...PDF_COLORS.muted);
  pdf.text("Descripcion", 18, 182);
  pdf.text("Horas", 138, 182);
  pdf.text("Tarifa", 156, 182);
  pdf.text("Importe", 194, 182, { align: "right" });

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...PDF_COLORS.ink);
  pdf.text(`Servicio tecnico ${report.category}`, 18, 193);
  pdf.text(`${report.durationHours.toFixed(1)} h`, 138, 193);
  pdf.text(formatCurrency(report.hourlyRate), 156, 193);
  pdf.text(formatCurrency(totalAmount), 194, 193, { align: "right" });

  drawSectionTitle(pdf, "Detalle tecnico", 216);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(...PDF_COLORS.ink);
  pdf.text("Incidencia", 14, 226);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...PDF_COLORS.body);
  pdf.text(report.reason, 14, 233, { maxWidth: 182 });

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...PDF_COLORS.ink);
  pdf.text("Trabajo realizado", 14, 246);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...PDF_COLORS.body);
  pdf.text(report.workDone, 14, 253, { maxWidth: 182 });

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(...PDF_COLORS.ink);
  pdf.text("Solucion aplicada", 14, 266);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...PDF_COLORS.body);
  pdf.text(report.solution, 14, 273, { maxWidth: 182 });

  pdf.addPage();
  drawHeader(pdf, "Conformidad", "Validacion del servicio y firma digital");

  drawSectionTitle(pdf, "Resumen economico", 54);
  drawLabeledRows(
    pdf,
    [
      ["Tarifa por hora", formatCurrency(report.hourlyRate)],
      ["Horas facturables", `${report.durationHours.toFixed(1)} h`],
      ["Mantenimiento", report.maintenanceIncluded ? "Incluido" : "No incluido"],
      ["Total factura", formatCurrency(totalAmount)]
    ],
    64,
    126
  );

  drawSectionTitle(pdf, "Conformidad del cliente", 108);
  pdf.setTextColor(...PDF_COLORS.body);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Firmado por: ${report.clientSignatureName || report.contact}`, 14, 118);
  pdf.text(`Fecha de firma: ${formatSignedDate(report.signedAt)}`, 14, 126);
  pdf.text("La firma digital confirma la recepcion y conformidad del servicio realizado.", 14, 136, {
    maxWidth: 182
  });

  pdf.setDrawColor(...PDF_COLORS.line);
  pdf.roundedRect(14, 150, 84, 40, 4, 4);
  pdf.roundedRect(112, 150, 84, 40, 4, 4);
  pdf.setTextColor(...PDF_COLORS.muted);
  pdf.text("Firma Ibersoft", 18, 185);
  pdf.text("Firma cliente", 116, 185);

  if (report.clientSignatureDataUrl) {
    try {
      pdf.addImage(report.clientSignatureDataUrl, "PNG", 120, 158, 58, 18);
    } catch {
      pdf.setTextColor(...PDF_COLORS.body);
      pdf.text("Firma digital registrada", 116, 168);
    }
  }

  drawSectionTitle(pdf, "Notas", 214);
  pdf.setTextColor(...PDF_COLORS.body);
  pdf.text(
    report.observations || "Documento generado desde WorkingParts para uso interno, validacion del cliente y soporte de facturacion.",
    14,
    224,
    { maxWidth: 182 }
  );

  drawFooter(pdf, `Factura ${report.id}`);
  return pdf;
}
