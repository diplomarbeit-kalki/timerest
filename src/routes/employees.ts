//import { createEmployeeController } from "../controllers/createEmployee";
import { getEmployees, getEmployeesById, getEmployeesByPsnr, getEmployeesByUsername, getEmployeesByFirstname, getEmployeesByLastname, getEmployeesNumberOfPages, getEmployeesNextFreePsnr, getEmployeesFilteredWithParameter, getEmployeesFiltered } from "../controllers/employees/getEmployees";
import { postEmployee } from "../controllers/employees/postEmployees";
import { putEmployee, putEmployeeWithPsnr } from "../controllers/employees/putEmployees";
import { deleteEmployee } from "../controllers/employees/deleteEmployees";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /employees');

//GET-Routen
router.get('/', getEmployees);
router.get('/byId', getEmployeesById);
router.get('/byPsnr', getEmployeesByPsnr);
router.get('/byUsername', getEmployeesByUsername);
router.get('/byFirstname', getEmployeesByFirstname);
router.get('/byLastname', getEmployeesByLastname);
router.get('/numberOfPages', getEmployeesNumberOfPages);
router.get('/nextFreePsnr', getEmployeesNextFreePsnr);
router.get('/filteredWithParameter', getEmployeesFilteredWithParameter);
router.get('/filtered', getEmployeesFiltered);

//POST-Routen
router.post('/', postEmployee);

//PUT-Routen
router.put('/withId/:id', putEmployee);
//PUT-Route für Tag
router.put('/withPsnr/:psnr', putEmployeeWithPsnr);

//DELETE-Routen
router.delete('/withId/:id', deleteEmployee);

module.exports = router;