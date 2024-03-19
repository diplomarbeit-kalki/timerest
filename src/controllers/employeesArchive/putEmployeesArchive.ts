import { ObjectId } from 'mongodb';

export async function putEmployeeIntoArchive(req: any, res: any) {
    try {
        const { db } = req.app;
        const { id } = req.params;

        const parsedId = new ObjectId(id);

        if (!id) {
            return res.status(400).json({ message: 'Id is required' });
        }


        var employee = await db.collection('employees').findOne({ _id: parsedId });
        employee.tag = null;
        const result = await db.collection('employeesArchive').insertOne(employee);
        const resultdel = await db.collection('employees').deleteOne({ _id: parsedId });
        if (result.acknowledged && resultdel.acknowledged) {
            res.status(200).json(`Employee archived`);
        }
        else {
            throw new Error('Employee archive failed');
        }
    }
    catch (error) {
        console.log(error.toString());
        res.status(500).json(error.toString());
    }
}