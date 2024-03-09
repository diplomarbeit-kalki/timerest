import { getTestPdf, getTimesheetFromMonth } from "../controllers/pdf/getPdf";

//Initialisierung
const express = require('express');
const router = express.Router();
console.log('Erstelle Routen: /pdf');

//GET-Routen
router.get('/', getTestPdf);
router.get('/timesheetFromMonth', getTimesheetFromMonth);

module.exports = router;