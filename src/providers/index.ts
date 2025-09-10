export interface PaymentProvider {
  initializePayment(input: any): Promise<any>;
  verifyPayment(reference: string): Promise<any>;
  refundPayment(input: any): Promise<any>;
  createCustomer(input: any): Promise<any>;
  createInvoice?(input: any): Promise<any>;
}
