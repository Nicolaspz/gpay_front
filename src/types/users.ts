export type AdminClient = {
  id: string;
  fullname: string;
  email: string;
  status: string;
  user_type: string;
  tenant?: {
    id?: string;
    tenant_id?: string;
    legal_name?: string;
    bank_iban?: string;
    bank_owner_name?: string;
    client_reference_count?: string;
  };
};

export type TenantPaymentSettings = {
  legal_name: string;
  bank_iban: string;
  bank_owner_name: string;
  client_reference_count: string;
};
