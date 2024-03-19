const path = require('path');
const fs = require('fs');

export async function getProfilepictureByPsnr(req: any, res: any) {
    const { psnr } = req.params;
    const { db } = req.app;
    const parsedPsnr = parseInt(psnr);

    if (!psnr) {
        return res.status(400).json({ message: 'Psnr is required' });
    }

    try {
        const result = await db.collection('employees').findOne({ psnr: parsedPsnr });
        const altBildPfad = path.join(__dirname, `../../../public/profilepictures/placeholder.webp`);

        if (!result) {
            if (psnr === "placeholder") {
                res.status(200).sendFile(altBildPfad);
                return;
            }
            else {
                return res.status(400).json({ message: 'Employee not found' });
            }
        }

        // Überprüfe, ob die Bilddatei existiert

        const bildPfad = path.join(__dirname, `../../../public/profilepictures/${result.profilepicture}.webp`);
       

        fs.exists(bildPfad, exists => {
            if (exists) {
                res.sendFile(bildPfad);
            }
            else {
                res.sendFile(altBildPfad);
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export async function getProfilepictureByPsnrArchived(req: any, res: any) {
    const { psnr } = req.params;
    const { db } = req.app;
    const parsedPsnr = parseInt(psnr);

    if (!psnr) {
        return res.status(400).json({ message: 'Psnr is required' });
    }

    try {
        const result = await db.collection('employeesArchive').findOne({ psnr: parsedPsnr });
        const altBildPfad = path.join(__dirname, `../../../public/profilepictures/placeholder.webp`);

        if (!result) {
            if (psnr === "placeholder") {
                res.status(200).sendFile(altBildPfad);
                return;
            }
            else {
                return res.status(400).json({ message: 'Employee not found' });
            }
        }

        // Überprüfe, ob die Bilddatei existiert

        const bildPfad = path.join(__dirname, `../../../public/profilepictures/${result.profilepicture}.webp`);
       

        fs.exists(bildPfad, exists => {
            if (exists) {
                res.sendFile(bildPfad);
            }
            else {
                res.sendFile(altBildPfad);
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}