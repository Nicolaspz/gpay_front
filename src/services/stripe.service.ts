import axios from "axios";

const BASE_URL = "https://stripe-server-ztck.onrender.com/api/v1";
const TOKEN = "Bearer GPayment_Secret_Default_2024";

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
};
