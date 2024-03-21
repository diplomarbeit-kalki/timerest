import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

const bildPfad = "images/profilepictures";
const currentDate = new Date();
const date = `${currentDate.getDate().toString().padStart(2, '0')}${(currentDate.getMonth()).toString().padStart(2, '0') + 1}${currentDate.getFullYear()}`;
const time = `${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;;
const filename = `-${date}-${time}`;

// Konfiguration für das Multer-Modul
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, bildPfad);
    },
    filename: function (req, file, cb) {
        const fileName = req.params.psnr + filename + path.extname(file.originalname);
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Funktion zum Konvertieren eines Bildes von JPG/PNG in WebP
async function convertToWebP(inputPath: string, outputPath: string) {
    await sharp(inputPath)
        .webp() // Konvertierung in WebP
        .toFile(outputPath);
}

export async function postProfilepicture(req: any, res: any) {
    const { psnr } = req.params;
    const { db } = req.app;

    const parsedPsnr = parseInt(psnr);
    if (!psnr) {
        return res.status(400).json({ message: 'Psnr is required' });
    }

    try {
        upload.single('image')(req, res, async function (err: any) {
            if (err instanceof multer.MulterError) {
                console.error('Fehler beim Hochladen des Bildes:', err);
                return res.status(400).send('Multer-Fehler: ' + err.message);
            }
            else if (err) {
                console.error('Fehler beim Hochladen des Bildes:', err);
                return res.status(500).send('Interner Serverfehler');
            }
            const imagePath = path.join(bildPfad, req.params.psnr + filename + path.extname(req.file.originalname));
            const webPImagePath = path.join(bildPfad, req.params.psnr + filename + '.webp');
            await convertToWebP(imagePath, webPImagePath);
            console.log("webPImagePath: " + webPImagePath);

            const imagePathDb = req.params.psnr + filename;
            console.log("imagePathDb: " + imagePathDb);

            const result = await db.collection('employees').updateOne(
                { psnr: parsedPsnr }, {
                $set: {
                    profilepicture: imagePathDb,
                    editeddate: new Date
                }
            });
            console.log("Result: " + JSON.stringify(result));
            if (result.acknowledged && result.modifiedCount > 0) {
                res.status(200).send();
            }
        });
    }
    catch (error) {
        console.error('Fehler beim Hochladen des Bildes:', error);
        res.status(500).send('Interner Serverfehler');
    }
}