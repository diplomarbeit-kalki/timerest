import { getCountEmployeesWithoutTag, getCountTransponders, getWorkingEmployeesCountFromActualMonth, getAverageWorkinghoursFromActualMonth } from "../controllers/cards/getCards";


//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /cards');

//GET-Routen
router.get('/countEmployeesWithoutTag', getCountEmployeesWithoutTag);
router.get('/countTransponders', getCountTransponders);
router.get('/workingEmployeesCountFromActualMonth', getWorkingEmployeesCountFromActualMonth);
router.get('/averageWorkinghoursFromActualMonth', getAverageWorkinghoursFromActualMonth);

module.exports = router;