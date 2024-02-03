import { getEmployees, getEmployeesById, getEmployeesByPsnr, getEmployeesByUsername, getEmployeesByFirstname, getEmployeesByLastname } from "../controllers/employees/getEmployees";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /timestamps');

//GET-Routen
router.get('/', getEmployees);
router.get('/byid/:id', getEmployeesById);
router.get('/byPsnr/:psnr', getEmployeesByPsnr);
router.get('/byUsername/:username', getEmployeesByUsername);
router.get('/byFirstname/:firstname', getEmployeesByFirstname);
router.get('/byLastname/:lastname', getEmployeesByLastname);

//router.post('/', createEmployeeController);

module.exports = router;