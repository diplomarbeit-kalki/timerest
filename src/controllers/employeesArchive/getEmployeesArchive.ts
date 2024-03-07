import { ObjectId } from "mongodb";

export async function getEmployeesArchive(req: any, res: any) {
  try {
    const { db } = req.app;
    const result = await db.collection('employeesArchive').find().toArray();

    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeeArchiveById(req: any, res: any) {
  try {
    const { db } = req.app;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Employee id is required' });
    }

    const parsedId = new ObjectId(id);

    const result = await db.collection('employeesArchive').find({
      _id: parsedId
    }).toArray();

    if (!result) {
      return res.status(404).json({ message: 'Archived Employee not found' });
    }

    res.status(200).json(result[0]);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesArchiveFiltered(req: any, res: any) {
    try {
      const { db } = req.app;
      var { query } = req.query;
  
      let psnrQuery;
      try {
        psnrQuery = parseInt(query);
      } catch { }
  
      if (!query) {
        query = "";
      }
  
      const result = await db.collection("employeesArchive").aggregate([
        {
          $match: {
            $or: [
              { "psnr": psnrQuery },
              { "username": { $regex: new RegExp(query, "i") } },
              { "firstname": { $regex: new RegExp(query, "i") } },
              { "lastname": { $regex: new RegExp(query, "i") } },
            ]
          }
        },
        {
          $sort: { "psnr": 1 }
        }
      ]).toArray();
  
      if (!result) {
        return res.status(404).json({ message: 'Archived Employees not found' });
      }
      res.status(200).json(result);
  
    }
    catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }