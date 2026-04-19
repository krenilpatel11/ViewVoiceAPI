import { Request, Response } from 'express';
import { parseAmazonInvoice } from '../../application/usecases/parse-amazon-invoice.usecase';
import { invoiceCache } from '../../infrastructure/cache/invoice-cache';

/** POST /api/documents/amazon — upload & parse an invoice */
export async function parseAmazon(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required. Send a multipart/form-data request with a field named "file".' });
  }

  try {
    const result = await parseAmazonInvoice(req.file.buffer);
    const cached = invoiceCache.add(req.file.originalname || 'unknown.pdf', result);
    return res.status(201).json(cached);
  } catch (err: any) {
    console.error('Invoice parse error:', err.message);
    return res.status(500).json({ error: err.message || 'Failed to parse invoice' });
  }
}

/** GET /api/documents — list all cached invoices */
export async function listInvoices(_req: Request, res: Response) {
  try {
    const invoices = invoiceCache.getAll();
    return res.json({ invoices, total: invoices.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

/** GET /api/documents/:id — get a specific cached invoice */
export async function getInvoice(req: Request, res: Response) {
  const invoice = invoiceCache.get(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  return res.json(invoice);
}

/** DELETE /api/documents/:id — remove an invoice from the cache */
export async function deleteInvoice(req: Request, res: Response) {
  const deleted = invoiceCache.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  return res.status(200).json({ message: 'Invoice deleted successfully' });
}
