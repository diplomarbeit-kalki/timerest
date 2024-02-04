import { ObjectId } from "mongodb";

export async function getEmployees(req: any, res: any) {
  try {
    const { db, webSocketConnections } = req.app;
    const result = await db.collection('employees').find().toArray();

    const message = "Status: KOMMT";
    webSocketConnections.forEach((ws) => {
      ws.send(message);
      console.log("Message gesendet");
    });

    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesById(req: any, res: any) {
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

    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesByPsnr(req: any, res: any) {
  try {
    const { db } = req.app;
    const { psnr } = req.params;

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

    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesByUsername(req: any, res: any) {
  try {
    const { db } = req.app;
    const { username } = req.params;

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
    const { firstname } = req.params;

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
    const { lastname } = req.params;

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

export async function getEmployeesNumberOfPages(req: any, res: any) {
  try {
    const { db } = req.app;
    const { query, itemsPerPage } = req.params;

    let psnrQuery;
    try {
      psnrQuery = parseInt(query);
    } catch { }

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    if (!itemsPerPage) {
      return res.status(400).json({ message: 'ItemsPerPage is required' });
    }

    const countResult = await db.collection("employees").aggregate([
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
        $count: "totalCount"
      }
    ]).toArray();
    const totalCount = countResult[0].totalCount
    console.log("Total Count: " + totalCount);

    const result = countResult.length > 0 ? countResult[0].totalCount : 0;
    const resultFormatted = Math.ceil(Number(result / itemsPerPage));
    console.log("Total Count angepasst: " + resultFormatted);

    if (!resultFormatted) {
      return res.status(404).json({ message: 'NumberOfPages not found' });
    }
    res.status(200).json(resultFormatted);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesNextFreePsnr(req: any, res: any) {
  try {
    const { db } = req.app;

    // Pipeline für die Aggregation
    const aggregationPipeline = [
      {
        $group: {
          _id: null,
          maxPsnr: { $max: "$psnr" },
        },
      },
    ];

    const result = await db.collection("employees").aggregate(aggregationPipeline).toArray();

    // Extrahiere die maximale Personalnummer
    const maxPsnr = result.length > 0 ? result[0].maxPsnr : 0;

    // Finde die nächste freie Personalnummer
    const nextFreePsnr = maxPsnr + 1;

    if (!nextFreePsnr) {
      return res.status(404).json({ message: 'NextFreePsnr not found' });
    }
    res.status(200).json(nextFreePsnr);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getEmployeesFiltered(req: any, res: any) {
  try {
    const { db } = req.app;
    const { query, itemsPerPage, currentPage } = req.params;

    const parsedItemsPerPage = parseInt(itemsPerPage);
    const parsedCurrentPage = parseInt(currentPage);
    let psnrQuery;
    try {
      psnrQuery = parseInt(query);
    } catch { }

    if (!query) {
      return res.status(400).json({ message: 'ItemsPerPage is required' });
    }
    if (!parsedItemsPerPage) {
      return res.status(400).json({ message: 'Query is required' });
    }
    if (!parsedCurrentPage) {
      return res.status(400).json({ message: 'CurrentPage is required' });
    }

    const offset = (parsedCurrentPage - 1) * parsedItemsPerPage;

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
      },
      {
        $skip: offset
      },
      {
        $limit: parsedItemsPerPage
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