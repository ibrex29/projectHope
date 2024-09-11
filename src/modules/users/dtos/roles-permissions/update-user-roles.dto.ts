import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdateUserRolesDto {
  @IsNotEmpty()
  @IsArray()
  roleNames: string[];
}
