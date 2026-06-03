export type Tenant = {
  tenant_id?: string;
  legal_name?: string;
  bank_iban?: string;
  bank_owner_name?: string;
  client_reference_count?: string;
};

export type User = {
  id?: string;
  fullname?: string;
  email?: string;
  token?: string;
  status?: string;
  user_type?: string;
  team_id?: string;
  tenant_id?: string;
  tenant?: Tenant;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
  role: string;
  telefone: string;
  user_name: string;
  
};

export type LoginResponse = {
  token: string;
  user: User;
};
