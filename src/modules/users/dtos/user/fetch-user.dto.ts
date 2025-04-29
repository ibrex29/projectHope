import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { FetchDTO } from 'src/common/dto';

enum UserSortFieldEnum {
  email = 'email',
  fullName = 'fullName',
  createdAt = 'createdAt',
}

export class FetchUsersDTO extends FetchDTO {
  @IsString()
  @IsUUID('4')
  @IsOptional()
  readonly role?: string;

  @IsString()
  @IsOptional()
  readonly roleName?: string;

  @IsEnum(UserSortFieldEnum)
  @IsOptional()
  readonly sortField?: UserSortFieldEnum;
}
