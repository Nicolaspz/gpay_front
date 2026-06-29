export type Tenant = {
  id?: string;
  tenant_id?: string;
  legal_name?: string;
  bank_iban?: string;
  bank_owner_name?: string;
  client_reference_count?: string;
  status?: string;
  gpayment_fee_percentage?: number;
};

export type User = {
  id?: string;
  fullname?: string;
  fullName?: string;
  email?: string;
  token?: string;
  status?: string;
  user_type?: string;
  team_id?: string;
  tenant_id?: string;
  tenant?: Tenant;
  photo_url?: string;
  user_photo?: string;
  phone_number?: string;
  gpayment_fee_percentage?: number;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  fullname: string;
  email: string;
  phone_number: string;
  password: string;
  confirmpassword: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type ResetPasswordPayload = {
  newPassword: string;
  confirmNewPassword: string;
};

export type ActivateAccountPayload = {
  token: string;
};
