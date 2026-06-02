export type ApiKey = {
  id: string;
  name: string;
  key: string;
  status: "active" | "inactive" | "expired";
  createdAt: string;
  expiresAt: string | null;
};

export type ApiKeyResponse = {
  id: string;
  name: string;
  value: string;
  expire_at?: string | null;
  created_at: string;
};

export type ApiKeyPayload = {
  name: string;
  tenant_id?: string;
  expire_at?: string;
};
