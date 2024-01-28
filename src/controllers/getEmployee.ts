import { ObjectId } from "mongodb";


export async function getEmployeeController(req: any, res: any) {
  try {
    const { db } = req.app;

    const { firstname } = req.params;

    if (!firstname) {
      return res.status(400).json({ message: 'Employee firstname is required' });
    }

    const result = await db.collection('employees').findOne({
      firstname: firstname
    });

    if (!result) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(result);

  }
  catch(error) {
    res.status(500).json({ error: error.toString() });
  }
}