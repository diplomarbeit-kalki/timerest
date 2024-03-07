const PDFDocument = require('pdfkit');

export async function getTestPdf(req: any, res: any) {
    
    const doc = new PDFDocument();

    // Einstellungen für die Antwort
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
    
    // Den PDF-Stream direkt an die Antwort senden
    doc.pipe(res);

    // PDF-Inhalt hinzufügen
    doc.fontSize(25).text('PDFKit in Node.js!', 100, 100);
    doc.moveTo(100, 150).lineTo(400, 150).stroke();

    // Das Dokument abschließen
    doc.end();
  }