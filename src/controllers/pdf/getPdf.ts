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

export async function getTimesheetFromMonth(req: any, res: any) {

  const { db } = req.app;
  const { month, year } = req.query;

  var parsedYear = parseInt(year);
  var parsedMonth = parseInt(month);

  if (!month) {
    return res.status(400).json({ message: 'Month is required' });
  }
  if (!year) {
    return res.status(400).json({ message: 'Year is required' });
  }
  console.log(`PDF---QUERYPARAMS---month: ${month}, year: ${year}`);


  const startDate = new Date(parsedYear, parsedMonth - 1, 1);
  const endDate = new Date(parsedYear, parsedMonth, 0);

  const startDateFormated = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
  const endDateFormated = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;

  console.log(`startdate: ${startDateFormated}, enddate: ${endDateFormated}`)

  const result = await db.collection('thimerecords').find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).toArray();

  if (!result) {
    return res.status(404).json({ message: 'Timerecords not found' });
  }

  console.log("Result: " + JSON.stringify(result));
  const doc = new PDFDocument();

  // Einstellungen für die Antwort
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

  // Den PDF-Stream direkt an die Antwort senden
  doc.pipe(res);

  // PDF-Inhalt hinzufügen
  doc.fontSize(25).text('PDFKit in Node.js!', 100, 100);
  doc.moveTo(100, 150).lineTo(400, 150).stroke();
  doc.fontSize(14).text('Zeile 1...', 100, 200);
  doc.fontSize(14).text('Zeile 2...', 100, 220);

  // Das Dokument abschließen
  doc.end();
}