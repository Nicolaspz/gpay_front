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
