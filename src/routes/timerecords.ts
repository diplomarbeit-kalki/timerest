import { getTimerecords, getTimerecordById, getTimerecordByPsnrAndDate, getTimerecordsByPsnrAndPeriod } from "../controllers/timerecords/getTimerecords";
import { postTimerecord } from "../controllers/timerecords/postTimerecords";
import { putTimerecordTimestamp} from "../controllers/timerecords/putTimerecords";
import { deleteTimerecordTimestamp} from "../controllers/timerecords/deleteTimerecords";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /timerecords');

//GET-Routen
router.get('/', getTimerecords);
router.get('/byid/:id', getTimerecordById);
router.get('/byPsnrAndDate', getTimerecordByPsnrAndDate); //IN VERWENDUNG
router.get('/byPsnrAndPeriod', getTimerecordsByPsnrAndPeriod); //IN VERWENDUNG

//PUT-Routen
router.put('/stamps', putTimerecordTimestamp); //IN VERWENDUNG

//DELETE-Routen
router.delete('/stamps', deleteTimerecordTimestamp); //IN VERWENDUNG

//POST-Routen
router.post('/', postTimerecord);

module.exports = router;