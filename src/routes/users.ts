import { getUsers, getUserById, getUserByUsername } from "../controllers/users/getUsers";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /employees');

//GET-Routen
router.get('/', getUsers);
router.get('/byId/:id', getUserById);
router.get('/byUsername/:username', getUserByUsername); //IN VERWENDUNG

module.exports = router;