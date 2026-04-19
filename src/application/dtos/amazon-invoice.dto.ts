import { AmazonInvoiceItemDto } from './amazon-invoice-item.dto';

export interface AmazonInvoiceDto {
  vendorName?: string;
  vendorAddress?: string;
  vendorTaxId?: string;

  orderNumber?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceTotal?: number;
  totalTax?: number;
  currency?: string;
  paymentMode?: string;
  customerName?: string;
  billingRecipientName?: string;
  billingAddress?: string;
  shippingRecipientName?: string;
  shippingAddress?: string;

  placeOfSupply?: string;
  placeOfDelivery?: string;
  sellerState?: string;
  buyerState?: string;

  items: AmazonInvoiceItemDto[];
}
