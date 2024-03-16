const PDFDocument = require('pdfkit');

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

function convertMinutesToHoursAndMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}min`;
}

export async function getTimesheetFromMonthWithPsnr(req: any, res: any) {

  const { db } = req.app;
  const { psnr, month, year } = req.query;

  var parsedPsnr = parseInt(psnr);
  if (!psnr) {
    return res.status(400).json({ message: 'Psnr is required' });
  }
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
  for (const dateStr of dates) {
    const documents = await db.collection('timerecords').find({ emppsnr: parsedPsnr, date: dateStr }).toArray();

    if (documents) {
      documents.forEach(document => {
        timerecords.push(document);
      });
    }
  }
  const results = await db.collection('employees').findOne({ psnr: parsedPsnr });
  const name = `${results.firstname} ${results.lastname}`;
  //console.log("array: " + JSON.stringify(timerecords));
  if (timerecords.length < 1) {
    return res.status(400).json({ message: 'Employee timerecords not found' });
  }
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

  const xSpalte1 = 70;
  const xSpalte2 = 227;
  const xSpalte3 = 384;
  const schriftgroeße = 10;

  doc.fontSize(schriftgroeße).text(`Datum`, xSpalte1, 145);
  doc.fontSize(schriftgroeße).text(`Arbeitszeit`, xSpalte2, 145);
  doc.fontSize(schriftgroeße).text(`Pausenzeit`, xSpalte3, 145);

  //Obere Querlinie 2
  doc.moveTo(xSpalte1, 160).lineTo(543, 160).stroke();

  var y = 182;
  const zeilenabstand = 15;
  var yline = 192;


  if (timerecords) {
    timerecords.forEach((timerecord, index) => {

      doc.fontSize(schriftgroeße).text(`${timerecord.date}`, xSpalte1, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.workingtime}`, xSpalte2, y);
      doc.fontSize(schriftgroeße).text(`${timerecord.breaktime}`, xSpalte3, y);

      // Nur zeichnen, wenn es nicht das letzte Element ist
      if (index < timerecords.length - 1) {
        doc.moveTo(xSpalte1, yline).lineTo(543, yline).stroke();
      }

      y += zeilenabstand;
      yline += zeilenabstand;
    });
  }

  const total = timerecords.reduce((acc, record) => {
    const workingMinutes = parseInt(record.workingminutes);
    const breakMinutes = parseInt(record.breakminutes);

    acc.workingTotal += workingMinutes;
    acc.breakTotal += breakMinutes;

    return acc;
  }, { workingTotal: 0, breakTotal: 0 });


  // Berechnung für Arbeitszeit
  const workTotalFormatted = convertMinutesToHoursAndMinutes(total.workingTotal);

  // Berechnung für Pausenzeit
  const breakTotalFormatted = convertMinutesToHoursAndMinutes(total.breakTotal);
  doc.fontSize(schriftgroeße).text(`${name}`, xSpalte1, 662);
  doc.fontSize(schriftgroeße).text(`${workTotalFormatted}`, xSpalte2, 662);
  doc.fontSize(schriftgroeße).text(`${breakTotalFormatted}`, xSpalte3, 662);

  // Das Dokument abschließen
  doc.end();
}

export async function getTimesheetFromMonthWithAllPsnr(req: any, res: any) {

  const { db } = req.app;
  const { month, year } = req.query;


  if (!month) {
    return res.status(400).json({ message: 'Month is required' });
  }
  if (!year) {
    return res.status(400).json({ message: 'Year is required' });
  }
  console.log(`PDF---QUERYPARAMS---month: ${month}, year: ${year}`);

  const parsedMonth = month.toString().padStart(2, '0');
  const firstdate = `01-${parsedMonth}-${year}`;
  const numberOfDays = getDaysInMonth(`${parsedMonth}-${year}`)
  const lastdate = `${numberOfDays.toString().padStart(2, '0')}-${parsedMonth}-${year}`;
  const dates = getDatesBetween(firstdate, lastdate);


  var psnrs = [];
  for (const dateStr of dates) {
    const documents = await db.collection('timerecords').find({ date: dateStr }).toArray();

    if (documents) {
      documents.forEach(document => {
        if (!psnrs.includes(document.emppsnr)) {
          psnrs.push(document.emppsnr);
        }
      });
    }
  }
  console.log("psnrs: " + JSON.stringify(psnrs));

  if (psnrs.length < 1) {
    return res.status(400).json({ message: 'Employee timerecords not found' });
  }
  const doc = new PDFDocument();

  // Einstellungen für die Antwort
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

  // Den PDF-Stream direkt an die Antwort senden
  doc.pipe(res);


  for (const [index, psnr] of psnrs.entries()) {
    console.log("For each anstelle psnr: " + psnr);
    var timerecords = [];
    for (const dateStr of dates) {
      const documents = await db.collection('timerecords').find({ emppsnr: psnr, date: dateStr }).toArray();

      if (documents) {
        documents.forEach(document => {
          timerecords.push(document);
        });
      }
    }
    const results = await db.collection('employees').findOne({ psnr: psnr });
    const name = `${results.firstname} ${results.lastname}`;

    doc.fontSize(25).text('Arbeitszeitverrechnung', 70, 70);
    doc.fontSize(20).text(`Zeitraum: ${parsedMonth}/${year}`, 70, 110);
    doc.fontSize(20).text(`Personalnummer: ${psnr}`, 306, 110);

    //Obere Querlinie
    doc.moveTo(70, 140).lineTo(543, 140).stroke();
    //Untere Querlinie
    doc.moveTo(70, 652).lineTo(543, 652).stroke();


    const xSpalte1 = 70;
    const xSpalte2 = 227;
    const xSpalte3 = 384;
    const schriftgroeße = 10;

    doc.fontSize(schriftgroeße).text(`Datum`, xSpalte1, 145);
    doc.fontSize(schriftgroeße).text(`Arbeitszeit`, xSpalte2, 145);
    doc.fontSize(schriftgroeße).text(`Pausenzeit`, xSpalte3, 145);

    //Obere Querlinie 2
    doc.moveTo(xSpalte1, 160).lineTo(543, 160).stroke();

    var y = 182;
    const zeilenabstand = 15;
    var yline = 192;


    if (timerecords) {
      timerecords.forEach((timerecord, index) => {

        doc.fontSize(schriftgroeße).text(`${timerecord.date}`, xSpalte1, y);
        doc.fontSize(schriftgroeße).text(`${timerecord.workingtime}`, xSpalte2, y);
        doc.fontSize(schriftgroeße).text(`${timerecord.breaktime}`, xSpalte3, y);

        // Nur zeichnen, wenn es nicht das letzte Element ist
        if (index < timerecords.length - 1) {
          doc.moveTo(xSpalte1, yline).lineTo(543, yline).stroke();
        }

        y += zeilenabstand;
        yline += zeilenabstand;
      });
    }

    const total = timerecords.reduce((acc, record) => {
      const workingMinutes = parseInt(record.workingminutes);
      const breakMinutes = parseInt(record.breakminutes);

      acc.workingTotal += workingMinutes;
      acc.breakTotal += breakMinutes;

      return acc;
    }, { workingTotal: 0, breakTotal: 0 });


    // Berechnung für Arbeitszeit
    const workTotalFormatted = convertMinutesToHoursAndMinutes(total.workingTotal);

    // Berechnung für Pausenzeit
    const breakTotalFormatted = convertMinutesToHoursAndMinutes(total.breakTotal);
    doc.fontSize(schriftgroeße).text(`${name}`, xSpalte1, 662);
    doc.fontSize(schriftgroeße).text(`${workTotalFormatted}`, xSpalte2, 662);
    doc.fontSize(schriftgroeße).text(`${breakTotalFormatted}`, xSpalte3, 662);

    if (index < psnrs.length - 1) {
      doc.addPage();
    }
  }

  doc.end();
}