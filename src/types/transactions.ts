export type TransactionStatus = "pending" | "success" | "failed" | string;

export type Transaction = {
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
  metadata?: string | Record<string, unknown>;
  tenant?: {
    legal_name?: string;
  };
};

export type ChartData = {
  date: string;
  pending: number;
  success: number;
  failed: number;
};

export type ReferencePaymentPayload = {
  amount: number;
  redirect_url: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  description: string;
  payment_method: string;
  transaction_type: "payment";
  transaction_id: string;
};

export type ReferencePaymentResponse = {
  data?: {
    responseStatus?: {
      reference?: {
        entity?: string;
        referenceNumber?: string;
      };
    };
  };
  message?: string;
};
