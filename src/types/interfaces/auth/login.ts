export interface LoginCredentialsPayload {
  username: string;
  password: string;
}

// as per Passport convention
export interface PassportUserObject {
  username: string;
  sub: string;
}
