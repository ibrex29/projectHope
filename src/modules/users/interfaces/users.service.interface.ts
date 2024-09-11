import { CreateUserParams, CreateUserProfileParams, UpdateUserParams } from "../types";


export interface UsersServiceInterface {
  findUsers(): Promise<any[]>;

  findUser(id: string): Promise<any>;

  createUser(userDetails: CreateUserParams): Promise<any>;

  updateUser(id: string, updateUserDetails: UpdateUserParams): Promise<any>;

  deleteUser(id: string): Promise<any>;

  createUserProfile(
    id: string,
    userProfileDetails: CreateUserProfileParams,
  ): Promise<CreateUserProfileParams>;
}
