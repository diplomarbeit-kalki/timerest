import { Int32, ObjectId } from "mongodb";

export async function getEmployees(req: any, res: any) {
  try {
    const { db } = req.app;

    const result = await db.collection('employees').find().toArray();

    res.status(200).json(result);
  }
  catch(error) {
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
  catch(error) {
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
    const parsedPsnr = new Int32(psnr);

    const result = await db.collection('employees').find({
      psnr: parsedPsnr
    }).toArray();

    if (result.length == 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(result);

  }
  catch(error) {
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
  catch(error) {
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
  catch(error) {
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
  catch(error) {
    res.status(500).json({ error: error.toString() });
  }
}