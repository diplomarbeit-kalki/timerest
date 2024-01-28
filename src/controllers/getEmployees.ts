

export async function getEmployeesController(req: any, res: any) {
  try {
    const { db } = req.app;

    const result = await db.collection('employees').find().toArray();

    res.status(200).json(result);

  }
  catch(error) {
    res.status(500).json({ error: error.toString() });
  }
}