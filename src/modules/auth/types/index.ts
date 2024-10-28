export type JwtPayload = {
  sub: string;
  roles: string[];
  phoneNumber: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
};


export type SessionUser = {
  userId: string;
  phoneNumber: string;
  email: string;
  roles: Array<string>;
};
