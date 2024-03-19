import { getProfilepictureByPsnr, getProfilepictureByPsnrArchived } from "../controllers/media/getMedia";
import { postProfilepicture } from "../controllers/media/postMedia";

//Initialisierung
const express = require('express');
const router = express.Router();
console.log('Erstelle Routen: /media');

//GET-Routen
router.get('/profilepictures/byPsnr/:psnr', getProfilepictureByPsnr);getProfilepictureByPsnrArchived
router.get('/profilepictures/byPsnrArchived/:psnr', getProfilepictureByPsnrArchived);

//POST-Routen
router.post('/profilepictures/withPsnr/:psnr', postProfilepicture); //IN VERWENDUNG

module.exports = router;