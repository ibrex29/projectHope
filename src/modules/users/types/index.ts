import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class SerializedUser {
  @Exclude()
  password: string;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}

export class FindOneParams {
  @IsUUID()
  id: string;
}

export type CreateUserParams = {
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
} & CreateUserProfileParams;

export type UpdateUserParams = {
  id?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
};

export type CreateUserProfileParams = {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
};
