//import { createEmployeeController } from "../controllers/createEmployee";
import { getEmployees, getEmployeesById, getEmployeesByPsnr, getEmployeesByUsername, getEmployeesByFirstname, getEmployeesByLastname, getEmployeesNumberOfPages, getEmployeesNextFreePsnr, getEmployeesFiltered } from "../controllers/employees/getEmployees";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /employees');

//GET-Routen
router.get('/', getEmployees);
router.get('/byid/:id', getEmployeesById);
router.get('/byPsnr/:psnr', getEmployeesByPsnr);
router.get('/byUsername/:username', getEmployeesByUsername);
router.get('/byFirstname/:firstname', getEmployeesByFirstname);
router.get('/byLastname/:lastname', getEmployeesByLastname);
router.get('/numberOfPages/:query/:itemsPerPage', getEmployeesNumberOfPages);
router.get('/nextFreePsnr', getEmployeesNextFreePsnr);
router.get('/filtered/:query/:itemsPerPage/:currentPage', getEmployeesFiltered);

//router.post('/', createEmployeeController);

module.exports = router;