export type TypeUserInfo = {
  id: string;
  picture: string;
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string | null;
  expiresAt?: string;
  provider: string;
};
