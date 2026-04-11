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
  workbook.subject = "Resumen de partes tecnicos";

  const sheet = workbook.addWorksheet("Partes");

  sheet.columns = [
    { header: "Parte", key: "id", width: 18 },
    { header: "Fecha", key: "date", width: 14 },
    { header: "Tecnico", key: "technician", width: 24 },
    { header: "Cliente", key: "client", width: 22 },
    { header: "Categoria", key: "category", width: 22 },
    { header: "Estado", key: "status", width: 18 },
    { header: "Duracion", key: "durationHours", width: 14 },
    { header: "Importe", key: "totalAmount", width: 14 }
  ];

  data.forEach((report) =>
    sheet.addRow({
      ...report,
      totalAmount: report.durationHours * report.hourlyRate
    })
  );

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFF8FAFC" } };
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0F172A" }
  };
  header.alignment = { vertical: "middle", horizontal: "center" };
  header.height = 24;

  sheet.eachRow((row, index) => {
    if (index === 1) return;
    row.height = 20;
    row.alignment = { vertical: "middle" };

    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" }
        };
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

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, 210, 34, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.text(IBERSOFT_BRAND.name, 14, 18);
  pdf.setFontSize(10);
  pdf.text("Resumen ejecutivo de partes", 14, 26);

  [
    ["Partes", `${data.length}`],
    ["Horas", `${totalHours.toFixed(1)} h`],
    ["Facturacion", formatCurrency(totalBilling)]
  ].forEach(([label, value], index) => {
    const x = 14 + index * 62;
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(x, 46, 56, 24, 4, 4);
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(10);
    pdf.text(label, x + 4, 55);
    pdf.setTextColor(20, 23, 28);
    pdf.setFontSize(13);
    pdf.text(value, x + 4, 65);
  });

  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Parte", 14, 84);
  pdf.text("Cliente", 44, 84);
  pdf.text("Categoria", 98, 84);
  pdf.text("Horas", 150, 84);
  pdf.text("Importe", 178, 84);
  pdf.line(14, 88, 196, 88);

  data.slice(0, 10).forEach((report, index) => {
    const y = 98 + index * 10;
    const total = formatCurrency(report.durationHours * report.hourlyRate);
    pdf.setTextColor(20, 23, 28);
    pdf.text(report.id, 14, y);
    pdf.text(report.client.slice(0, 24), 44, y);
    pdf.text(report.category.slice(0, 22), 98, y);
    pdf.text(`${report.durationHours.toFixed(1)} h`, 150, y);
    pdf.text(total, 196, y, { align: "right" });
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
  pdf.text("Parte tecnico · Factura de servicio", 14, 26);

  pdf.setFontSize(10);
  pdf.text(`${IBERSOFT_BRAND.legalName}`, 138, 15);
  pdf.text(`${IBERSOFT_BRAND.email}`, 138, 21);
  pdf.text(`${IBERSOFT_BRAND.website}`, 138, 27);

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
  pdf.text(formatCurrency(totalAmount), 180, 158, { align: "right" });

  pdf.setTextColor(100, 116, 139);
  pdf.text("Salida de mantenimiento", 14, 168);
  pdf.text(report.maintenanceIncluded ? "Incluida" : "No", 128, 168);
  pdf.text(formatCurrency(0), 154, 168);
  pdf.text(formatCurrency(0), 180, 168, { align: "right" });

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
