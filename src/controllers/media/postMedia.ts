import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const bildPfad = "public/profilepictures";

// Konfiguration für das Multer-Modul
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Pfad zum Ordner, in dem die Bilder gespeichert werden sollen
        cb(null, bildPfad);
    },
    filename: function (req, file, cb) {
        // Dateiname des gespeicherten Bildes
        const fileName = req.params.psnr + path.extname(file.originalname); // PSNR mit Dateiendung
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
    try {
        // Upload-Funktion von Multer aufrufen, um das Bild zu verarbeiten
        upload.single('image')(req, res, async function (err: any) {
            if (err instanceof multer.MulterError) {
                // Multer-Fehler behandeln
                console.error('Fehler beim Hochladen des Bildes:', err);
                return res.status(400).send('Multer-Fehler: ' + err.message);
            } else if (err) {
                // Andere Fehler behandeln
                console.error('Fehler beim Hochladen des Bildes:', err);
                return res.status(500).send('Interner Serverfehler');
            }

            // Pfad zum hochgeladenen Bild
            const imagePath = path.join(bildPfad, req.params.psnr + path.extname(req.file.originalname));

            // Pfad für das konvertierte WebP-Bild
            const webPImagePath = path.join(bildPfad, req.params.psnr + '.webp');

            // Bild in WebP konvertieren
            await convertToWebP(imagePath, webPImagePath);

            // Erfolgsmeldung zurückgeben
            console.log('Bild erfolgreich hochgeladen und in WebP konvertiert:', webPImagePath);
            res.status(200).send('Bild erfolgreich hochgeladen und in WebP konvertiert');
        });
    } catch (error) {
        console.error('Fehler beim Hochladen des Bildes:', error);
        res.status(500).send('Interner Serverfehler');
    }
}
