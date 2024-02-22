//import { createEmployeeController } from "../controllers/createEmployee";
import { getEmployees, getEmployeesById, getEmployeesByPsnr, getEmployeesByUsername, getEmployeesByFirstname, getEmployeesByLastname, getEmployeesNumberOfPages, getEmployeesNextFreePsnr, getEmployeesFiltered } from "../controllers/employees/getEmployees";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /employees');

//GET-Routen
router.get('/', getEmployees);
router.get('/byid', getEmployeesById);
router.get('/byPsnr', getEmployeesByPsnr);
router.get('/byUsername', getEmployeesByUsername);
router.get('/byFirstname', getEmployeesByFirstname);
router.get('/byLastname', getEmployeesByLastname);
router.get('/numberOfPages', getEmployeesNumberOfPages);
router.get('/nextFreePsnr', getEmployeesNextFreePsnr);
router.get('/filtered', getEmployeesFiltered);

module.exports = router;