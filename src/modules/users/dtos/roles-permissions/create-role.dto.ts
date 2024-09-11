import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @IsOptional()
  @IsString()
  description: string;
}
