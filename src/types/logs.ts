export type Log = {
  id: string;
  action: string;
  user_name?: string;
  user_email?: string;
  user_id?: string;
  details?: string;
  ip_address?: string;
  resource?: string;
  resource_id?: string;
  created_at: string;
};
