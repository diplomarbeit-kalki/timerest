//import { createEmployeeController } from "../controllers/createEmployee";
import { getEmployeeController } from "../controllers/getEmployee";
import { getEmployeesController } from "../controllers/getEmployees";


const express  = require('express');

const router = express.Router();

console.log('employees route');

router.get('/', getEmployeesController);
//router.post('/', createEmployeeController);

router.get('/:firstname', getEmployeeController);

module.exports = router;