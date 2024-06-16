export interface InvoiceI{
    order_id: string;
    client_id: string;
    invoice_nr: string;
    created_at: string;
    nip:  string;
}
export interface InvoiceCreateI extends Omit<InvoiceI, "nip">{
    nip: number;
}
