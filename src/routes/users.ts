import { getUsers, getUsersById, getUserByUsername } from "../controllers/users/getUsers";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /employees');

//GET-Routen
router.get('/', getUsers);
router.get('/byId/:id', getUsersById);
router.get('/byUsername/:username', getUserByUsername);

module.exports = router;