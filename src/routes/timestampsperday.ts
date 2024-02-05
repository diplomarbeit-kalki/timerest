import { getTimestampsperday, getTimestampsperdayById } from "../controllers/timestampsperday/getTimestampsperday";
import { postTimestampperdayWithPsnr } from "../controllers/timestampsperday/postTimestampperday";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /timestamps');

//GET-Routen
router.get('/', getTimestampsperday);
router.get('/byid/:id', getTimestampsperdayById);

router.post('/', postTimestampperdayWithPsnr);

module.exports = router;