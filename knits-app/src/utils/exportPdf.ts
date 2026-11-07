import { jsPDF } from 'jspdf';
import { Order } from '@/types';
import { calculateRunRate } from '@/utils/runRate';

export function generateBuyerStatusPdf(orders: Order[], buyerFilterName?: string): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(30, 41, 59); // Slate-900
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('KNITS - EXPORT PRODUCTION REPORT', 14, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tiruppur Manufacturing Facility • Client: ${buyerFilterName || 'All Buyers (UK & EU)'}`, 14, 26);
  doc.text(`Generated: ${new Date().toISOString().split('T')[0]}`, 140, 26);

  let y = 45;

  orders.forEach((order, index) => {
    const runRate = calculateRunRate(order);

    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    // Order Card Header
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, 182, 38, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, 182, 38, 'D');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${order.poNumber} — ${order.buyerName}`, 18, y + 8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Style: ${order.style} (${order.color})`, 18, y + 16);
    doc.text(`Total Qty: ${order.totalQuantity.toLocaleString()} pcs  |  Current Stage: ${order.currentStage} (${order.stageQuantityCompleted.toLocaleString()} pcs)`, 18, y + 23);
    
    // Status & Run-rate
    const statusText = `Ex-Factory: ${order.exFactoryDate} | Pace: ${runRate.actualDailyRunRate} pcs/day (Required: ${runRate.requiredDailyRunRate} pcs/day)`;
    doc.text(statusText, 18, y + 30);

    // Severity pill
    if (runRate.severity === 'red') {
      doc.setTextColor(225, 29, 72);
      doc.setFont('helvetica', 'bold');
      doc.text(`[CRITICAL DELAY: +${runRate.delayDays}d]`, 140, y + 8);
    } else if (runRate.severity === 'amber') {
      doc.setTextColor(217, 119, 6);
      doc.setFont('helvetica', 'bold');
      doc.text(`[AMBER: TIGHT PACE]`, 140, y + 8);
    } else {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text(`[ON TRACK]`, 140, y + 8);
    }

    y += 44;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Knits Exporter OS • Tiruppur India • Strict Tenant Isolated Compliance Document', 14, 285);

  doc.save(`Knits_Production_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}

