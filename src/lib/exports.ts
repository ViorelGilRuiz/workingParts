import { WorkReport } from "@/types";

export async function buildExcelWorkbook(data: WorkReport[]) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Partes");

  sheet.columns = [
    { header: "Parte", key: "id", width: 18 },
    { header: "Fecha", key: "date", width: 14 },
    { header: "Tecnico", key: "technician", width: 24 },
    { header: "Cliente", key: "client", width: 22 },
    { header: "Categoria", key: "category", width: 22 },
    { header: "Estado", key: "status", width: 18 },
    { header: "Duracion", key: "durationHours", width: 14 }
  ];

  data.forEach((report) => sheet.addRow(report));
  return workbook;
}

export async function buildPdfSummary(data: WorkReport[]) {
  const jsPDF = (await import("jspdf")).default;
  const pdf = new jsPDF();
  pdf.setFontSize(18);
  pdf.text("Resumen de partes tecnicos", 14, 18);
  pdf.setFontSize(11);

  data.slice(0, 8).forEach((report, index) => {
    pdf.text(`${report.id} · ${report.client} · ${report.category} · ${report.durationHours}h`, 14, 34 + index * 10);
  });

  return pdf;
}
