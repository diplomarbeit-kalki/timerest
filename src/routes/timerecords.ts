import { getTimerecords, getTimerecordById, getTimerecordByPsnrAndDate, getTimerecordsByPsnrAndPeriod } from "../controllers/timerecords/getTimerecords";
import { postTimerecords } from "../controllers/timerecords/postTimerecords";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /timerecords');

//GET-Routen
router.get('/', getTimerecords);
router.get('/byid', getTimerecordById);
router.get('/byPsnrAndDate', getTimerecordByPsnrAndDate);
router.get('/byPsnrAndPeriod', getTimerecordsByPsnrAndPeriod);

//POST-Routen
router.post('/', postTimerecords);

module.exports = router;