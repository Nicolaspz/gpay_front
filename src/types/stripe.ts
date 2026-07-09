export type StripeTransaction = {
  id: number;
  stripeSessionId: string | null;
  userId: string;
  internalTransactionId: string;
  grossAmount: number;
  feeAmount: number;
  stripeFee: number | null;
  gpaymentFee: number | null;
  stripeFeePercentage: number | null;
  stripeFixedFee: number | null;
  gpaymentFeePercentage: number | null;
  feeCalculatedAt: string | null;
  netAmount: number;
  amount: number;
  currency: string;
  status: string;
  isPaidOut: boolean | null;
  paidOutAt: string | null;
  receiptUrl: string | null;
  balanceCreditedAt: string | null;
  createdAt: string | null;
  clientWebhookUrl: string | null;
  fullname?: string;
};

export type StripeSummary = {
  totalGrossAmount: number;
  totalNetAmount: number;
  totalPendingPayoutAmount: number;
  totalPaidOutAmount: number;
  currency: string;
};

export type ClientBalance = {
  id?: string;
  userId?: string;
  balance: number;
  currency: string;
  updatedAt?: string;
};

export type StripeStats = {
  totalGross: number;
  totalNet: number;
  totalPending: number;
  totalPaid: number;
  count: number;
  totalGrossUSD: number;
  totalGrossAOA: number;
  totalNetUSD: number;
  totalNetAOA: number;
};

export type PayPayBalance = {
  available_amount: number;
  total_credited: number;
  total_debited: number;
  currency: string;
  updated_at: string;
};

export type PayPayMovement = {
  id: number;
  type: "credit" | "debit" | "ignored";
  amount: number;
  reference: string | null;
  description: string | null;
  paypay_transaction_id: string | null;
  internal_transaction_id: string | null;
  created_at: string;
};

export type PayPayTopupPayload = {
  amount: number;
  reference: string;
  description?: string;
};

export type PayPayValidateDebitPayload = {
  amount: number;
};

export type WithdrawalValidationResponse = {
  valid: boolean;
  current_balance: number;
  requested_amount: number;
  currency: string;
  message?: string;
};

export type RebuildBalancesResponse = {
  message: string;
  transactions_processed: number;
};

export type AdminClientSummary = {
  userId: string;
  fullname?: string;
  email?: string;
  totalTransactions: number;
  totalGrossAmount: number;
  totalNetAmount: number;
  currency: string;
};

export type TransactionSummaryResponse = {
  totalGrossAmount: number;
  totalNetAmount: number;
  totalPendingPayoutAmount: number;
  totalPaidOutAmount: number;
  currency: string;
  transactionCount: number;
};

export type PayPayWebhookPayload = {
  event_type: string;
  paypay_transaction_id: string;
  internal_transaction_id: string;
  amount: number;
  currency: string;
  status: string;
  message?: string;
};

export type ClientBalanceByCurrency = {
  userId: string;
  balance: number;
  currency: string;
  updatedAt?: string;
};
