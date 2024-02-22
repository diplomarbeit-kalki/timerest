import { ObjectId } from "mongodb";

export async function getUsers(req: any, res: any) {
  try {
    const { db } = req.app;
    const result = await db.collection('users').find().toArray();

    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getUsersById(req: any, res: any) {
  try {
    const { db } = req.app;
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Id id is required' });
    }

    const parsedId = new ObjectId(id);

    const result = await db.collection('users').find({
      _id: parsedId
    }).toArray();

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getUserByUsername(req: any, res: any) {
  try {
    const { db } = req.app;
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: 'User username is required' });
    }

    const result = await db.collection('users').findOne({
      username: username
    });

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result);

  }
  catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}