import { getUnregisteredtags } from "../controllers/unregisteredtags/getUnregisteredtags";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /unregisteredtags');

//GET-Routen
router.get('/', getUnregisteredtags);

//router.post('/', createEmployeeController);

module.exports = router;