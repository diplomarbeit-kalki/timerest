//import { createEmployeeController } from "../controllers/createEmployee";
import { getEmployees, getEmployeeById, getEmployeeByPsnr, getEmployeesByUsername, getEmployeesByFirstname, getEmployeesByLastname, getNextFreePsnr, getEmployeesFiltered, getEmployeesWithoutTransponder, getEmployeesWithoutTransponderFiltered } from "../controllers/employees/getEmployees";
import { postEmployee } from "../controllers/employees/postEmployees";
import { putEmployeeWithId, putEmployeeWithPsnr, putEmployeeFromArchive } from "../controllers/employees/putEmployees";
import { deleteEmployeeWithId, deleteTagFromEmpoyeeWithId } from "../controllers/employees/deleteEmployees";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /employees');

//GET-Routen
router.get('/', getEmployees);
router.get('/byId/:id', getEmployeeById);
router.get('/byPsnr/:psnr', getEmployeeByPsnr);
router.get('/byUsername', getEmployeesByUsername);
router.get('/byFirstname', getEmployeesByFirstname);
router.get('/byLastname', getEmployeesByLastname);
router.get('/nextFreePsnr', getNextFreePsnr);
router.get('/filtered', getEmployeesFiltered);
router.get('/withoutTransponder', getEmployeesWithoutTransponder);
router.get('/withoutTransponder/filtered', getEmployeesWithoutTransponderFiltered);

//POST-Routen
router.post('/', postEmployee);

//PUT-Routen
router.put('/withId/:id', putEmployeeWithId);
router.put('/fromArchive/withId/:id', putEmployeeFromArchive);
//PUT-Route für Tag
router.put('/withPsnr/:psnr', putEmployeeWithPsnr);

//DELETE-Routen
router.delete('/withId/:id', deleteEmployeeWithId);
router.delete('/tag/withId/:id', deleteTagFromEmpoyeeWithId);

module.exports = router;