export type StripeTransaction = {
  id: string;
  createdAt: string;
  grossAmount: number;
  netAmount: number;
  currency: string;
  status: string;
  isPaidOut: boolean;
  fullname?: string;
  userId?: string;
  stripeSessionId?: string;
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
};
