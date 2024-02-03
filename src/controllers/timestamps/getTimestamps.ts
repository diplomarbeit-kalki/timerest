import { ObjectId } from "mongodb";

export async function getTimestamps(req: any, res: any) {
    try {
      const { db } = req.app;
  
      const result = await db.collection('timestamps').find().toArray();
  
      res.status(200).json(result);
    }
    catch(error) {
      res.status(500).json({ error: error.toString() });
    }
  }

  export async function getTimestampsById(req: any, res: any) {
    try {
      const { db } = req.app;
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: 'Employee id is required' });
      }
  
      const parsedId = new ObjectId(id);
  
      const result = await db.collection('timestamps').find({
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