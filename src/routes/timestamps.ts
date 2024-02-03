import { getTimestamps, getTimestampsById } from "../controllers/timestamps/getTimestamps";
import { createTimestamp } from "../controllers/timestamps/createTimestamp";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /timestamps');

//GET-Routen
router.get('/', getTimestamps);
router.get('/byid/:id', getTimestampsById);

router.post('/', createTimestamp);

module.exports = router;