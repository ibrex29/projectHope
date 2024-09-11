export type JwtPayload = {
  sub: string;
  roles: string[];
  phoneNumber: string;
  email?: string;
};

export type SessionUser = {
  userId: string;
  phoneNumber: string;
  email: string;
  roles: Array<string>;
};
