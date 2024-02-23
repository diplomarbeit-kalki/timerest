import axios from 'axios';

function createUsername(firstname: string, lastname: string): string {
    const firstPart = firstname.length >= 3 ? firstname.substring(0, 3).toUpperCase() : firstname.toUpperCase();
    const lastPart = lastname.length >= 3 ? lastname.substring(0, 3).toUpperCase() : lastname.toUpperCase();
    return lastPart + firstPart;
}

export async function postEmployee(req: any, res: any) {
    try {
        const { db, webSocketConnections } = req.app;
        var { firstname, lastname, birthdate, street, housenr, residence, postalcode, phonenr, email } = req.body;

        console.log("Employee---POST-Anfrage: " + JSON.stringify(req.body));

        if (!firstname) {
            return res.status(400).json({ message: 'Firstname is required' });
        }
        if (!lastname) {
            return res.status(400).json({ message: 'Lastname is required' });
        }
        if (!birthdate) {
            birthdate = null;
        }
        if (!street) {
            street = null;
        }
        if (!housenr) {
            housenr = null;
        }
        if (!residence) {
            residence = null;
        }
        if (!postalcode) {
            postalcode = null;
        }
        if (!phonenr) {
            phonenr = null;
        }
        if (!email) {
            email = null;
        }

        const nextFreePsnrResponse = await axios.get(`http://localhost:3001/employees/nextFreePsnr`);
        if (!nextFreePsnrResponse) {
            throw new Error('Failed to fetch next free PSNR');
        }
        const psnr = parseInt(nextFreePsnrResponse.data);

        const employee = {
            psnr: psnr,
            tag: null,
            pictureSrc: null,
            username: createUsername(firstname, lastname),
            firstname: firstname,
            lastname: lastname,
            birthdate: birthdate,
            street: street,
            housenr: housenr,
            residence: residence,
            postalcode: postalcode,
            phonenr: phonenr,
            email: email,
            createddate: new Date,
            editeddate: new Date,
        };

        const result = await db.collection('employees').insertOne(employee);
        if (result.acknowledged) {
            res.status(201).json(`Employee created`);
        }
        else {
            throw new Error('Employee creation failed');
        }
    }
    catch (error) {
        console.log(error.toString());
        res.status(500).json(error.toString());
    }
}
