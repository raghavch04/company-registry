import express from 'express';
import {
  registerCompany,
  getAllCompanies
} from '../controllers/companyController.js';

const router = express.Router();

router.route('/')
  .post(registerCompany)
  .get(getAllCompanies);

export default router;