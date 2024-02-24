import axios from 'axios';
import { ObjectId } from 'mongodb';

function createUsername(firstname: string, lastname: string): string {
    const firstPart = firstname.length >= 3 ? firstname.substring(0, 3).toUpperCase() : firstname.toUpperCase();
    const lastPart = lastname.length >= 3 ? lastname.substring(0, 3).toUpperCase() : lastname.toUpperCase();
    return lastPart + firstPart;
}

export async function putEmployee(req: any, res: any) {
    try {
        const { db } = req.app;
        const { id } = req.params;
        var { firstname, lastname, birthdate, street, housenr, residence, postalcode, phonenr, email } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        const parsedId = new ObjectId(id);

        const result = await db.collection('employees').updateOne(
            { _id: parsedId }, {
            $set: {
                firstname: firstname,
                lastname: lastname,
                username: createUsername(firstname, lastname),
                birthdate: birthdate,
                street: street,
                housenr: housenr,
                residence: residence,
                postalcode: postalcode,
                phonenr: phonenr,
                email: email,
                editeddate: new Date
            }
        });

        if (result.acknowledged) {
            res.status(200).json(`Employee updated`);
        }
        else {
            throw new Error('Employee update failed');
        }
    }
    catch (error) {
        console.log(error.toString());
        res.status(500).json(error.toString());
    }
}

export async function putEmployeeWithPsnr(req: any, res: any) {
    try {
        const { db } = req.app;
        const { psnr } = req.params;
        var { tag } = req.body;

        if (!tag) {
            return res.status(400).json({ message: 'Tag is required' });
        }
        const parsedPsnr = parseInt(psnr);

        const result = await db.collection('employees').updateOne(
            { psnr: parsedPsnr }, {
            $set: {
                tag: tag
            }
        });

        if (result.acknowledged) {
            res.status(200).json(`Employee updated`);
        }
        else {
            throw new Error('Employee update failed');
        }
    }
    catch (error) {
        console.log(error.toString());
        res.status(500).json(error.toString());
    }
}