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

function getDatesBetween(startDateStr: string, endDateStr: string): string[] {
  const startDateParts = startDateStr.split('-').map(part => parseInt(part));
  const endDateParts = endDateStr.split('-').map(part => parseInt(part));

  const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
  const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);

  const dateArray: string[] = [];
  const currentDate = startDate;

  while (currentDate <= endDate) {
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());

    dateArray.push(`${day}-${month}-${year}`);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

function getDaysInMonth(monthYear: string): number {
  // Monat und Jahr aus dem String extrahieren
  const [monthStr, yearStr] = monthYear.split('-').map(str => parseInt(str));
  const month = monthStr - 1; // Monate im Date-Objekt beginnen bei 0

  // Datum auf den ersten Tag des Monats setzen
  const date = new Date(yearStr, month, 1);

  // Zum ersten Tag des nächsten Monats springen und einen Tag zurückgehen
  date.setMonth(date.getMonth() + 1);
  date.setDate(date.getDate() - 1);

  // Den Tag des Monats zurückgeben
  return date.getDate();
}

export async function getTimesheetFromMonth(req: any, res: any) {

  const { db } = req.app;
  const { psnr, month, year } = req.query;

  var parsedPsnr = parseInt(psnr);

  if (!month) {
    return res.status(400).json({ message: 'Month is required' });
  }
  if (!year) {
    return res.status(400).json({ message: 'Year is required' });
  }
  console.log(`PDF---QUERYPARAMS---month: ${month}, year: ${year}, psnr: ${psnr}`);

  const parsedMonth = month.toString().padStart(2, '0');
  const firstdate = `01-${parsedMonth}-${year}`;
  const numberOfDays = getDaysInMonth(`${parsedMonth}-${year}`)
  const lastdate = `${numberOfDays.toString().padStart(2, '0')}-${parsedMonth}-${year}`;
  const dates = getDatesBetween(firstdate, lastdate);

  var timerecords = [];
  if (!parsedPsnr) {
    for (const dateStr of dates) {
      const documents = await db.collection('timerecords').find({ date: dateStr }).toArray();

      if (documents) {
        documents.forEach(document => {
          timerecords.push(document);
        });
      }
    }
  }
  else {
    for (const dateStr of dates) {
      const documents = await db.collection('timerecords').find({ emppsnr: parsedPsnr, date: dateStr }).toArray();

      if (documents) {
        documents.forEach(document => {
          timerecords.push(document);
        });
      }
    }
  }
  //console.log("array: " + JSON.stringify(timerecords));

  //Maß X: 613
  //Maß Y: 792
  const doc = new PDFDocument();

  // Einstellungen für die Antwort
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

  // Den PDF-Stream direkt an die Antwort senden
  doc.pipe(res);

  // PDF-Inhalt hinzufügen
  doc.fontSize(25).text('Arbeitszeitverrechnung', 70, 70);
  doc.fontSize(20).text(`Zeitraum: ${parsedMonth}/${year}`, 70, 110);
  doc.fontSize(20).text(`Personalnummer: ${parsedPsnr}`, 306, 110);

  //Obere Querlinie
  doc.moveTo(70, 140).lineTo(543, 140).stroke();
  //Untere Querlinie
  doc.moveTo(70, 652).lineTo(543, 652).stroke();

  /*
  //Oben
  doc.moveTo(70, 70).lineTo(543, 70).stroke();
  //Links
  doc.moveTo(70, 70).lineTo(70, 722).stroke();
  //Rechts
  doc.moveTo(543, 70).lineTo(543, 722).stroke();
  //Unten
  doc.moveTo(70, 722).lineTo(543, 722).stroke();
  */


  const xSpalte1 = 70;
  const xSpalte2 = 227;
  const xSpalte3 = 384;
  const schriftgroeße = 10;

  doc.fontSize(schriftgroeße).text(`Datum`, xSpalte1, 150);
  doc.fontSize(schriftgroeße).text(`Arbeitszeit`, xSpalte2, 150);
  doc.fontSize(schriftgroeße).text(`Pausenzeit`, xSpalte3, 150);

  //Obere Querlinie 2
  doc.moveTo(xSpalte1, 172).lineTo(543, 172).stroke();

  var y = 182;
  const zeilenabstand = 15;
  var yline = 192;


  if (timerecords) {
    timerecords.forEach(timerecord => {

      doc.fontSize(schriftgroeße).text(`${timerecord.date}`, xSpalte1, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.workingtime}`, xSpalte2, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.breaktime}`, xSpalte3, y);

      doc.moveTo(xSpalte1, yline).lineTo(543, yline).stroke();
      y += zeilenabstand;
      yline += zeilenabstand;

      doc.fontSize(schriftgroeße).text(`${timerecord.date}`, xSpalte1, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.workingtime}`, xSpalte2, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.breaktime}`, xSpalte3, y);

      doc.moveTo(xSpalte1, yline).lineTo(543, yline).stroke();
      y += zeilenabstand;
      yline += zeilenabstand;

      doc.fontSize(schriftgroeße).text(`${timerecord.date}`, xSpalte1, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.workingtime}`, xSpalte2, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.breaktime}`, xSpalte3, y);

      doc.moveTo(xSpalte1, yline).lineTo(543, yline).stroke();
      y += zeilenabstand;
      yline += zeilenabstand;

      doc.fontSize(schriftgroeße).text(`${timerecord.date}`, xSpalte1, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.workingtime}`, xSpalte2, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.breaktime}`, xSpalte3, y);

      doc.moveTo(xSpalte1, yline).lineTo(543, yline).stroke();
      y += zeilenabstand;
      yline += zeilenabstand;

      doc.fontSize(schriftgroeße).text(`${timerecord.date}`, xSpalte1, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.workingtime}`, xSpalte2, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.breaktime}`, xSpalte3, y);

      doc.moveTo(xSpalte1, yline).lineTo(543, yline).stroke();
      y += zeilenabstand;
      yline += zeilenabstand;

      doc.fontSize(schriftgroeße).text(`${timerecord.date}`, xSpalte1, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.workingtime}`, xSpalte2, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.breaktime}`, xSpalte3, y);

      doc.moveTo(xSpalte1, yline).lineTo(543, yline).stroke();
      y += zeilenabstand;
      yline += zeilenabstand;
    });
  }
  doc.fontSize(schriftgroeße).text(`${timerecords[0].date}`, xSpalte1, y);
  doc.fontSize(schriftgroeße).text(`${timerecords[0].workingtime}`, xSpalte2, y);
  doc.fontSize(schriftgroeße).text(`${timerecords[0].breaktime}`, xSpalte3, y);

  doc.fontSize(schriftgroeße).text(`Summe`, {
    align: 'justify'
  },
    xSpalte1, 662);
  doc.fontSize(schriftgroeße).text(`Platzhalterarbeitszeit`, xSpalte2, 662);
  doc.fontSize(schriftgroeße).text(`Platzhalterpausenzeit`, xSpalte3, 662);

  // Das Dokument abschließen
  doc.end();
}