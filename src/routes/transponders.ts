import { getTransponders, getTransponderById } from "../controllers/transponders/getTransponders";
import { deleteTransponder } from "../controllers/transponders/deleteTransponders";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /transponders');

//GET-Routen
router.get('/', getTransponders);
router.get('/byId/:id', getTransponderById);

//DELETE-Routen
router.delete('/withId/:id', deleteTransponder); 

module.exports = router;