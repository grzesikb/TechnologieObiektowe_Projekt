export interface InvoiceItemI{
    invoice_id: string;
    name: string;
    count: string | undefined;
    price_per_item: string | undefined;
}

export interface InvoiceItemPrintI{
    name: string;
    count: string | undefined;
    price_per_item: string | undefined;
}

export interface InvoiceItemCreateI {
    invoice_id: string;
    name: string;
    count: number | undefined;
    price_per_item: number | undefined;
}
