import { Exclude, Expose } from 'class-transformer';

export class SerializedUser {
  id: string;
  email: string;

  profile: {
    firstName: string;
    middleName: string;
    lastName: string;
  };

  phoneNumber: string;
  isActive: boolean;

  @Exclude()
  password: string;

  @Expose()
  get fullName(): string {
    return this.profile?.middleName
      ? `${this.profile?.firstName} ${this.profile?.middleName} ${this.profile?.lastName}`
      : `${this.profile?.firstName} ${this.profile?.lastName}`;
  }

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
