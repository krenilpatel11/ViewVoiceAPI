import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import {
  parseAmazon,
  listInvoices,
  getInvoice,
  deleteInvoice,
} from '../controllers/documents.controller';

const router = Router();

// List all cached invoices
router.get('/', listInvoices);

// Upload and parse an invoice
router.post('/amazon', upload.single('file'), parseAmazon);

// Get a specific invoice by id
router.get('/:id', getInvoice);

// Delete an invoice from cache
router.delete('/:id', deleteInvoice);

export default router;
