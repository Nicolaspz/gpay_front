import axios from "axios";

const BASE_URL = "https://stripe-server-ztck.onrender.com/api/v1";
// const TOKEN = "Bearer GPayment_Secret_Default_2024";
const TOKEN = "Bearer esThMBm0WHxXZiNK6ptlkuRAoPn7IwVv1CSLjzJDdcGbYFya5Oqg39fE8Qr42U"

export const StripeService = {
  getSummaries(userId: string | undefined) {
    return axios.get(`${BASE_URL}/transactions/user/${userId}/summaries`, {
      headers: { Authorization: TOKEN },
    });
  },

  getNewTransactions(isAdmin: boolean, userId: string | undefined) {
    const endpoint = isAdmin
      ? "/transactions/admin/all"
      : `/transactions/user/${userId}`;

    return axios.get(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: TOKEN },
    });
  },

  getClientBalances(userId: string) {
    return axios.get(`${BASE_URL}/client-balances/user/${userId}`, {
      headers: { Authorization: TOKEN },
    });
  },

  // PayPay Fund
  getPayPayBalance() {
    return axios.get(`${BASE_URL}/paypay-fund/admin/balance`, {
      headers: { Authorization: TOKEN },
    });
  },

  getPayPayMovements() {
    return axios.get(`${BASE_URL}/paypay-fund/admin/movements`, {
      headers: { Authorization: TOKEN },
    });
  },

  createPayPayTopup(payload: { amount: number; reference: string; description?: string }) {
    return axios.post(`${BASE_URL}/paypay-fund/admin/topups`, payload, {
      headers: { Authorization: TOKEN },
    });
  },

  validatePayPayDebit(payload: { amount: number }) {
    return axios.post(`${BASE_URL}/paypay-fund/admin/validate-debit`, payload, {
      headers: { Authorization: TOKEN },
    });
  },

  // Client Balances
  getAllClientBalances() {
    return axios.get(`${BASE_URL}/client-balances/admin/all`, {
      headers: { Authorization: TOKEN },
    });
  },

  getClientBalanceByCurrency(userId: string, currency: string) {
    return axios.get(`${BASE_URL}/client-balances/user/${userId}/${currency}`, {
      headers: { Authorization: TOKEN },
    });
  },

  validateWithdrawal(userId: string, payload: { amount: number; currency: string }) {
    return axios.post(
      `${BASE_URL}/client-balances/user/${userId}/validate-withdrawal`,
      payload,
      { headers: { Authorization: TOKEN } }
    );
  },

  rebuildBalances() {
    return axios.post(`${BASE_URL}/client-balances/admin/rebuild-from-transactions`, null, {
      headers: { Authorization: TOKEN },
    });
  },

  // Transactions
  getTransactionSummary(userId: string) {
    return axios.get(`${BASE_URL}/transactions/user/${userId}/summary`, {
      headers: { Authorization: TOKEN },
    });
  },

  getAdminClientsSummary() {
    return axios.get(`${BASE_URL}/transactions/admin/clients`, {
      headers: { Authorization: TOKEN },
    });
  },

  // Webhook PayPay (simulação/teste)
  sendPayPayWebhook(payload: {
    event_type: string;
    paypay_transaction_id: string;
    internal_transaction_id: string;
    amount: number;
    currency: string;
    status: string;
    message?: string;
  }) {
    return axios.post(`${BASE_URL.replace("/api/v1", "")}/webhook/paypay`, payload, {
      headers: { Authorization: TOKEN },
    });
  },
};
