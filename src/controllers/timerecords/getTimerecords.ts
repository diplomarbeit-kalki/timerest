import { Int32, ObjectId } from "mongodb";

export async function getTimerecords(req: any, res: any) {
  try {
    const { db } = req.app;
    const result = await db.collection('timerecords').find().toArray();

    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getTimerecordById(req: any, res: any) {
  try {
    const { db } = req.app;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }

    const parsedId = new ObjectId(id);

    const result = await db.collection('timerecords').findOne({
      _id: parsedId
    });

    if (!result) {
      return res.status(404).json({ message: 'Timerecord not found' });
    }
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getTimerecordByPsnrAndDate(req: any, res: any) {
  try {
    const { db } = req.app;
    const { psnr, date } = req.query;

    const parsedPsnr = new Int32(psnr);

    if (!psnr) {
      return res.status(400).json({ message: 'Psnr is required' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    const result = await db.collection('timerecords').findOne({ emppsnr: parsedPsnr, date: date });

    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
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

export async function getTimerecordsByPsnrAndPeriod(req: any, res: any) {
  try {
    const { db } = req.app;
    const { psnr, firstdate, lastdate } = req.query;
    const parsedPsnr = parseInt(psnr)

    if (!psnr) {
      return res.status(400).json({ message: 'Psnr is required' });
    }
    if (!firstdate) {
      return res.status(400).json({ message: 'Firstdate is required' });
    }
    if (!lastdate) {
      return res.status(400).json({ message: 'Lastdate is required' });
    }

    const dates = getDatesBetween(firstdate, lastdate);
    
    const timerecords = [];
    if (dates) {
      for (const date of dates) {
        const result = await db.collection('timerecords').findOne({ "emppsnr": parsedPsnr, "date": date });
        if (result) {
          timerecords.push(result);
        }
      }
    }
    res.status(200).json(timerecords);
    
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}