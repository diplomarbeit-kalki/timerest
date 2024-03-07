import { ObjectId } from "mongodb";

export async function getEmployees(req: any, res: any) {
  try {
    const { db } = req.app;
    const result = await db.collection('employees').find().toArray();

    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeeById(req: any, res: any) {
  try {
    const { db } = req.app;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Employee id is required' });
    }

    const parsedId = new ObjectId(id);

    const result = await db.collection('employees').find({
      _id: parsedId
    }).toArray();

    if (!result) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(result[0]);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeeByPsnr(req: any, res: any) {
  try {
    const { db } = req.app;
    const { psnr } = req.query;

    if (!psnr) {
      return res.status(400).json({ message: 'Employee psnr is required' });
    }
    const parsedPsnr = parseInt(psnr);

    const result = await db.collection('employees').find({
      psnr: parsedPsnr
    }).toArray();

    if (result.length == 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(result[0]);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesByUsername(req: any, res: any) {
  try {
    const { db } = req.app;
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: 'Employee username is required' });
    }

    const result = await db.collection('employees').find({
      username: username
    }).toArray();;

    if (!result) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesByFirstname(req: any, res: any) {
  try {
    const { db } = req.app;
    const { firstname } = req.query;

    if (!firstname) {
      return res.status(400).json({ message: 'Employee firstname is required' });
    }

    const result = await db.collection('employees').find({
      firstname: firstname
    }).toArray();;

    if (!result) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesByLastname(req: any, res: any) {
  try {
    const { db } = req.app;
    const { lastname } = req.query;

    if (!lastname) {
      return res.status(400).json({ message: 'Employee lastname is required' });
    }

    const result = await db.collection('employees').find({
      lastname: lastname
    }).toArray();

    if (!result) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getNextFreePsnr(req: any, res: any) {
  try {
    const { db } = req.app;

    var highestPsnrEmployees = 0;
    var highestPsnrEmployeesArchive = 0;
    var highestPsnr = 0;

    const res1 = await db.collection("employees").find().sort({ psnr: -1 }).limit(1).toArray();
    if (res1[0].psnr) {
      highestPsnrEmployees = res1[0].psnr;
    }
    const res2 = await db.collection("employeesArchive").find().sort({ psnr: -1 }).limit(1).toArray();
    if (res2[0].psnr) {
      highestPsnrEmployeesArchive = res2[0].psnr;
    }
    if (highestPsnrEmployeesArchive > highestPsnrEmployees) {
      highestPsnr = highestPsnrEmployeesArchive;
    }
    else {
      highestPsnr = highestPsnrEmployees;
    }

    const nextFreePsnr = highestPsnr + 1;
    res.status(200).json(nextFreePsnr);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesFiltered(req: any, res: any) {
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

    const result = await db.collection("employees").aggregate([
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
      return res.status(404).json({ message: 'Employees not found' });
    }
    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesWithoutTransponder(req: any, res: any) {
  try {
    const { db } = req.app;
    const result = await db.collection('employees').find({
      $or: [
        { tag: { $exists: false } },
        { tag: null }
      ]
    }).sort({ "psnr": 1 }).toArray();

    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}