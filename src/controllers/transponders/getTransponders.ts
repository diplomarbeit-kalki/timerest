import { ObjectId } from "mongodb";

export async function getTransponders(req: any, res: any) {
    try {
        const { db } = req.app;

        const result = await db.collection('transponders').find().toArray();

        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export async function getTransponderById(req: any, res: any) {
    try {
      const { db } = req.app;
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Id is required' });
      }
      const parsedId = new ObjectId(id);
      const result = await db.collection('transponders').findOne({
        _id: parsedId
      });
  
      if (!result) {
        return res.status(404).json({ message: 'Transponder not found' });
      }
      res.status(200).json(result);
    }
    catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }