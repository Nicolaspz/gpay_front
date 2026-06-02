export type Webhook = {
  id: string;
  name: string;
  endpoint: string;
  tenant_id: string;
  secret_key: string;
  created_at?: string;
};

export type WebhookPayload = {
  name: string;
  endpoint: string;
  tenant_id?: string;
};
