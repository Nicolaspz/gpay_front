export type PaymentMethodApi = {
  id: string;
  name: string;
  type: string;
  rsa_key?: string;
  redirect_url?: string;
  merchant_id?: string;
  merchant_member_id?: string;
  sale_product_code?: string;
  async_url?: string;
  rsa_key_priv?: string;
  rsa_key_pub?: string;
  created_at: string;
  updated_at: string;
};

export type PaymentMethodForm = {
  id?: string;
  rsa_key: string;
  redirect_url: string;
  merchant_id: string;
  merchant_member_id: string;
  sale_product_code: string;
  async_url: string;
  rsa_key_priv: string;
  rsa_key_pub: string;
  created_at?: string;
  updated_at?: string;
};

export type PaymentMethodView = {
  id: string;
  name: string;
  data: PaymentMethodForm;
};
