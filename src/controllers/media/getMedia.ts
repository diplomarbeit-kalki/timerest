const path = require('path');
const fs = require('fs');

export async function getProfilepictureByPsnr(req: any, res: any) {
    const { psnr } = req.params;
    try {
        const bildPfad = path.join(__dirname, `../../../public/profilepictures/${psnr}.webp`);
        // Überprüfe, ob die Bilddatei existiert
        fs.exists(bildPfad, exists => {
            if (exists) {
                res.sendFile(bildPfad);
            } else {
                res.status(404).send({"message":'Bild nicht gefunden'});
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}