export interface IAuth {
  email: string;
  password: string;
}
export interface IAuthSignIn {
  email: string;
  password: string;
  repeatPassword: string;
}

export interface IAccountSettings {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}
