import { getEmployeesArchive, getEmployeeArchiveById, getEmployeesArchiveFiltered } from "../controllers/employeesArchive/getEmployeesArchive";
import { putEmployeeIntoArchive } from "../controllers/employeesArchive/putEmployeesArchive";
import { deleteEmployeeArchiveWithId } from "../controllers/employeesArchive/deleteEmployeesArchive";

//Initialisierung
const express  = require('express');
const router = express.Router();
console.log('Erstelle Routen: /employees');

//GET-Routen
router.get('/', getEmployeesArchive); //IN VERWENDUNG
router.get('/byId/:id', getEmployeeArchiveById); //IN VERWENDUNG
router.get('/filtered', getEmployeesArchiveFiltered); //IN VERWENDUNG

//PUT-Routen
router.put('/intoArchive/withId/:id', putEmployeeIntoArchive); //IN VERWENDUNG

//DELETE-Routen
router.delete('/withId/:id', deleteEmployeeArchiveWithId); //IN VERWENDUNG

module.exports = router;