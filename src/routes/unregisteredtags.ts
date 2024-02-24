import { getUnregisteredtags } from "../controllers/unregisteredtags/getUnregisteredtags";
import { deleteUnregisteredtag } from "../controllers/unregisteredtags/deleteUnregisteredtags";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /unregisteredtags');

//GET-Routen
router.get('/', getUnregisteredtags);

//DELETE-Routen
router.delete('/withId/:id', deleteUnregisteredtag); 

module.exports = router;