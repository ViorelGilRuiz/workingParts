import { WorkReport } from "@/types";

export const IBERSOFT_BRAND = {
  name: "Ibersoft",
  legalName: "Ibersoft Servicios IT",
  email: "administracion@ibersoft.es",
  website: "www.ibersoft.es",
  hourlyRate: 50
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

export async function buildExcelWorkbook(data: WorkReport[]) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = IBERSOFT_BRAND.name;
  workbook.created = new Date();
  workbook.modified = new Date();

  const summarySheet = workbook.addWorksheet("Resumen ejecutivo", {
    views: [{ state: "frozen", ySplit: 4 }]
  });
  const detailSheet = workbook.addWorksheet("Detalle de partes", {
    views: [{ state: "frozen", ySplit: 1 }]
  });

  const totalHours = data.reduce((sum, report) => sum + report.durationHours, 0);
  const totalAmount = data.reduce((sum, report) => sum + report.durationHours * report.hourlyRate, 0);
  const signedReports = data.filter((report) => report.hasSignature).length;
  const pendingReports = data.filter((report) => report.status === "Pendiente" || report.status === "En seguimiento").length;

  summarySheet.columns = [
    { key: "a", width: 28 },
    { key: "b", width: 26 },
    { key: "c", width: 18 }
  ];
  summarySheet.mergeCells("A1:C1");
  summarySheet.getCell("A1").value = `${IBERSOFT_BRAND.name} | Resumen operativo`;
  summarySheet.getCell("A1").font = { size: 18, bold: true, color: { argb: "FF0F172A" } };
  summarySheet.getCell("A2").value = "Generado";
  summarySheet.getCell("B2").value = new Date().toLocaleString("es-ES");
  summarySheet.getCell("A3").value = "Estado";
  summarySheet.getCell("B3").value = `${data.length} partes | ${totalHours.toFixed(1)} h | ${formatCurrency(totalAmount)}`;

  [
    ["Partes totales", `${data.length}`],
    ["Horas registradas", `${totalHours.toFixed(1)} h`],
    ["Importe estimado", formatCurrency(totalAmount)],
    ["Firmados", `${signedReports}`],
    ["Pendientes", `${pendingReports}`]
  ].forEach(([label, value], index) => {
    const row = summarySheet.getRow(5 + index);
    row.getCell(1).value = label;
    row.getCell(2).value = value;
    row.getCell(1).font = { bold: true };
    row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
    row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } };
  });

  detailSheet.columns = [
    { header: "Parte", key: "id", width: 18 },
    { header: "Fecha", key: "date", width: 14 },
    { header: "Tecnico", key: "technician", width: 24 },
    { header: "Cliente", key: "client", width: 22 },
    { header: "Empresa", key: "company", width: 26 },
    { header: "Categoria", key: "category", width: 22 },
    { header: "Estado", key: "status", width: 18 },
    { header: "Prioridad", key: "priority", width: 14 },
    { header: "Duracion", key: "durationHours", width: 14 },
    { header: "Importe", key: "totalAmount", width: 14 },
    { header: "Firma", key: "signature", width: 14 },
    { header: "Observaciones", key: "observations", width: 38 }
  ];
  detailSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  detailSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  detailSheet.autoFilter = "A1:L1";

  data.forEach((report) => {
    const row = detailSheet.addRow({
      ...report,
      totalAmount: report.durationHours * report.hourlyRate,
      signature: report.hasSignature ? "Firmado" : "Pendiente"
    });

    row.getCell(2).numFmt = "dd/mm/yyyy";
    row.getCell(9).numFmt = '0.0" h"';
    row.getCell(10).numFmt = '#,##0.00 [$EUR]';
    row.alignment = { vertical: "middle", wrapText: true };
  });

  detailSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    if (rowNumber % 2 === 0) {
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

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 28, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.text(`${IBERSOFT_BRAND.name} | Resumen de partes`, 14, 18);
  pdf.setFontSize(9);
  pdf.text(new Date().toLocaleString("es-ES"), 196, 18, { align: "right" });

  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(11);
  data.slice(0, 8).forEach((report, index) => {
    const total = formatCurrency(report.durationHours * report.hourlyRate);
    const y = 44 + index * 18;
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(14, y - 7, 182, 12, 3, 3);
    pdf.text(`${report.id} | ${report.client}`, 18, y);
    pdf.text(`${report.category} | ${report.durationHours.toFixed(1)} h | ${total}`, 18, y + 5);
  });

  return pdf;
}

export async function buildReportInvoicePdf(report: WorkReport) {
  const jsPDF = (await import("jspdf")).default;
  const pdf = new jsPDF();
  const totalAmount = report.durationHours * report.hourlyRate;

  pdf.setFillColor(11, 18, 32);
  pdf.rect(0, 0, 210, 34, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text(IBERSOFT_BRAND.name, 14, 18);
  pdf.setFontSize(10);
  pdf.text("Parte tecnico | Factura de servicio", 14, 26);

  pdf.setFontSize(10);
  pdf.text(IBERSOFT_BRAND.legalName, 138, 15);
  pdf.text(IBERSOFT_BRAND.email, 138, 21);
  pdf.text(IBERSOFT_BRAND.website, 138, 27);

  pdf.setTextColor(20, 23, 28);
  pdf.setFontSize(12);
  pdf.text("Datos del servicio", 14, 48);
  pdf.setDrawColor(220, 226, 234);
  pdf.line(14, 51, 196, 51);

  const serviceRows = [
    ["Parte", report.id],
    ["Fecha", report.date],
    ["Cliente", report.client],
    ["Empresa", report.company],
    ["Contacto", report.contact],
    ["Tecnico", report.technician],
    ["Horario", `${report.startTime} - ${report.endTime}`],
    ["Categoria", report.category]
  ];

  serviceRows.forEach(([label, value], index) => {
    const y = 60 + index * 8;
    pdf.setTextColor(100, 116, 139);
    pdf.text(label, 14, y);
    pdf.setTextColor(20, 23, 28);
    pdf.text(value, 48, y);
  });

  pdf.setFontSize(12);
  pdf.text("Concepto facturable", 14, 136);
  pdf.line(14, 139, 196, 139);

  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Descripcion", 14, 148);
  pdf.text("Cantidad", 128, 148);
  pdf.text("Precio", 154, 148);
  pdf.text("Importe", 180, 148);

  pdf.setTextColor(20, 23, 28);
  pdf.text(`Servicio tecnico ${report.category}`, 14, 158);
  pdf.text(`${report.durationHours.toFixed(1)} h`, 128, 158);
  pdf.text(formatCurrency(report.hourlyRate), 154, 158);
  pdf.text(formatCurrency(totalAmount), 196, 158, { align: "right" });

  pdf.setTextColor(100, 116, 139);
  pdf.text("Salida de mantenimiento", 14, 168);
  pdf.text(report.maintenanceIncluded ? "Incluida" : "No", 128, 168);
  pdf.text(formatCurrency(0), 154, 168);
  pdf.text(formatCurrency(0), 196, 168, { align: "right" });

  pdf.setDrawColor(220, 226, 234);
  pdf.line(128, 176, 196, 176);
  pdf.setTextColor(20, 23, 28);
  pdf.setFontSize(12);
  pdf.text("Total", 154, 184);
  pdf.text(formatCurrency(totalAmount), 196, 184, { align: "right" });

  pdf.setFontSize(11);
  pdf.text("Incidencia", 14, 198);
  pdf.setFontSize(10);
  pdf.setTextColor(55, 65, 81);
  pdf.text(report.reason, 14, 206, { maxWidth: 182 });

  pdf.setTextColor(20, 23, 28);
  pdf.text("Trabajo realizado", 14, 220);
  pdf.setTextColor(55, 65, 81);
  pdf.text(report.workDone, 14, 228, { maxWidth: 182 });

  pdf.setTextColor(20, 23, 28);
  pdf.text("Solucion aplicada", 14, 244);
  pdf.setTextColor(55, 65, 81);
  pdf.text(report.solution, 14, 252, { maxWidth: 182 });

  pdf.setTextColor(20, 23, 28);
  pdf.text("Conformidad del cliente", 14, 268);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Firmado por: ${report.clientSignatureName || report.contact}`, 14, 276);
  pdf.text(`Fecha de firma: ${formatSignedDate(report.signedAt)}`, 14, 282);
  pdf.text("La firma digital confirma la conformidad del servicio y el importe indicado.", 14, 288);

  pdf.setDrawColor(148, 163, 184);
  pdf.line(14, 296, 94, 296);
  pdf.line(118, 296, 196, 296);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Firma Ibersoft", 14, 302);
  pdf.text("Firma cliente", 118, 302);

  if (report.clientSignatureDataUrl) {
    try {
      pdf.addImage(report.clientSignatureDataUrl, "PNG", 118, 284, 58, 10);
    } catch {
      pdf.text("Firma digital registrada", 118, 290);
    }
  }

  return pdf;
}
