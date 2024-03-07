import { getTestPdf } from "../controllers/pdf/getPdf";

//Initialisierung
const express = require('express');
const router = express.Router();
console.log('Erstelle Routen: /pdf');

//GET-Routen
router.get('/', getTestPdf);

module.exports = router;