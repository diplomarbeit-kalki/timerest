import { ObjectId } from "mongodb";

export async function deleteEmployeeWithId(req: any, res: any) {
    try {
        const { db } = req.app;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        const parsedId = new ObjectId(id);

        const result = await db.collection('employees').deleteOne({ _id: parsedId });
        if (result.acknowledged) {
            res.status(200).json(`Employee deleted`);
        }
        else {
            throw new Error('Employee deletion failed');
        }
    }
    catch (error) {
        console.log(error.toString());
        res.status(500).json(error.toString());
    }
}