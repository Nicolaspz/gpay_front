export type TransactionStatus = "pending" | "success" | "failed";

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  payment_method: string;
  tenant_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shop_name: string;
  created_at: string; 
  metadata?: string;
}

export type ChartData = {
  date: string;
  pending: number;
  success: number;
  failed: number;
};
