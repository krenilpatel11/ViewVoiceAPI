export interface AmazonInvoiceItemDto {
  itemDescription?: string;
  productCode?: string;
  hsnCode?: string;
  quantity?: number;
  unitPrice?: number;
  discountAmount?: number;
  netAmount?: number;
  taxRate?: string;
  taxType?: string;
  taxAmount?: number;
  lineTotal?: number;
}
