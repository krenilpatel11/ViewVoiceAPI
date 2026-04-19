import { AmazonInvoiceDto } from '../../application/dtos/amazon-invoice.dto';

export interface CachedInvoice {
  id: string;
  filename: string;
  parsedAt: string;
  data: AmazonInvoiceDto;
}

class InvoiceCache {
  private cache: Map<string, CachedInvoice> = new Map();

  add(filename: string, data: AmazonInvoiceDto): CachedInvoice {
    const id = crypto.randomUUID();
    const entry: CachedInvoice = {
      id,
      filename,
      parsedAt: new Date().toISOString(),
      data
    };
    this.cache.set(id, entry);
    return entry;
  }

  get(id: string): CachedInvoice | undefined {
    return this.cache.get(id);
  }

  getAll(): CachedInvoice[] {
    return Array.from(this.cache.values()).sort(
      (a, b) => new Date(b.parsedAt).getTime() - new Date(a.parsedAt).getTime()
    );
  }

  delete(id: string): boolean {
    return this.cache.delete(id);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Singleton instance shared across all requests in the same process
export const invoiceCache = new InvoiceCache();
