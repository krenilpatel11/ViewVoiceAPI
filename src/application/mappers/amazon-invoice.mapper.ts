import { AmazonInvoiceDto } from '../dtos/amazon-invoice.dto';

function parseMoney(value?: string): number | undefined {
  if (!value) return undefined;
  return Number(value.replace(/[^0-9.]/g, ''));
}

function parseCurrency(value?: string, currencyCode?: string): string | undefined {
  // Use Azure DI's ISO currency code first (most reliable)
  if (currencyCode) return currencyCode;
  if (!value) return undefined;
  // Fall back to symbol detection — order matters (A$ and C$ before plain $)
  if (value.includes('₹')) return 'INR';
  if (value.includes('€')) return 'EUR';
  if (value.includes('£')) return 'GBP';
  if (value.includes('¥')) return 'JPY';
  if (value.includes('A$')) return 'AUD';
  if (value.includes('C$')) return 'CAD';
  if (value.includes('$')) return 'USD';
  return undefined;
}

export function mapAmazonInvoice(result: any): AmazonInvoiceDto {
  const doc = result.documents?.[0];
  const f = doc?.fields || {};

  return {
    vendorName: f.VendorName?.valueString,
    vendorTaxId: f.VendorTaxId?.valueString,

    vendorAddress: f.VendorAddress?.valueString,

    orderNumber: f.OrderNumber?.valueString,
    invoiceNumber: f.InvoiceId?.valueString,
    invoiceDate: f.InvoiceDate?.valueDate,

    invoiceTotal: parseMoney(f.InvoiceTotal?.valueString),
    totalTax: parseMoney(f.TotalTax?.valueString),
    currency: parseCurrency(f.InvoiceTotal?.valueString, f.InvoiceTotal?.valueCurrency?.currencyCode),

    billingRecipientName: f.BillingAddressRecipient?.valueString,
    billingAddress: f.BillingAddress?.valueString,

    shippingRecipientName: f.ShippingAddressRecipient?.valueString,
    shippingAddress: f.ShippingAddress?.valueString,

    customerName: f.CustomerName?.valueString,

    items: (f.Items?.valueArray || []).map((i: any) => {
      const item = i.valueObject || {};
      return {
        itemDescription: item.Description?.valueString,
        quantity: item.Quantity?.valueNumber,
        unitPrice: parseMoney(item.UnitPrice?.valueString),
        netAmount: parseMoney(item.NetAmount?.valueString),
        taxRate: item.TaxRate?.valueString,
        taxType: item.TaxType?.valueString,
        taxAmount: parseMoney(item.TaxAmount?.valueString),
        lineTotal: parseMoney(item.TotalAmount?.valueString)
      };
    })
  };
}
