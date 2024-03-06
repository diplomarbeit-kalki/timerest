//import { createEmployeeController } from "../controllers/createEmployee";
import { getEmployees, getEmployeeById, getEmployeeByPsnr, getEmployeesByUsername, getEmployeesByFirstname, getEmployeesByLastname, getNextFreePsnr, getEmployeesFiltered } from "../controllers/employees/getEmployees";
import { postEmployee } from "../controllers/employees/postEmployees";
import { putEmployeeWithId, putEmployeeWithPsnr } from "../controllers/employees/putEmployees";
import { deleteEmployeeWithId } from "../controllers/employees/deleteEmployees";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /employees');

//GET-Routen
router.get('/', getEmployees);
router.get('/byId/:id', getEmployeeById); //IN VERWENDUNG
router.get('/byPsnr/:psnr', getEmployeeByPsnr);
router.get('/byUsername', getEmployeesByUsername);
router.get('/byFirstname', getEmployeesByFirstname);
router.get('/byLastname', getEmployeesByLastname);
router.get('/nextFreePsnr', getNextFreePsnr); //IN VERWENDUNG
router.get('/filtered', getEmployeesFiltered); //IN VERWENDUNG

//POST-Routen
router.post('/', postEmployee); //IN VERWENDUNG

//PUT-Routen
router.put('/withId/:id', putEmployeeWithId); //IN VERWENDUNG
//PUT-Route für Tag
router.put('/withPsnr/:psnr', putEmployeeWithPsnr); //IN VERWENDUNG

//DELETE-Routen
router.delete('/withId/:id', deleteEmployeeWithId); //IN VERWENDUNG

module.exports = router;