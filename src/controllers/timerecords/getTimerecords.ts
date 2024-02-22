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
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }

    const parsedId = new ObjectId(id);

    const result = await db.collection('timerecords').find({
      _id: parsedId
    }).toArray();

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

function getDatesBetween(firstDate: string, lastDate: string) {
  const datesArray = [];

  const startDate = new Date(firstDate);
  const endDate = new Date(lastDate);

  let currentDate = startDate;
  while (currentDate <= endDate) {
    datesArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return datesArray;
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

    var trimmedDates;
    const dates = getDatesBetween(firstdate, lastdate);
    if(dates) {
      trimmedDates = dates.map(date => date.toISOString().split('T')[0]);
    }

    const timerecords = [];
    if (trimmedDates) {
      for (const date of trimmedDates) {
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