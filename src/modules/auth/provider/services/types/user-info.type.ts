export type TypeUserInfo = {
  id: string;
  picture: string;
  name: string;
  email: string;
  access_token?: string;
  refresh_token?: string | null;
  expires_at?: number;
  provider: string;
};
