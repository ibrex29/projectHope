import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateProfileDto } from '../profile/create-user-profile.dto';
import { UpdateUserProfileDto } from '../profile/update-user-profile.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['profile'] as const),
) {
  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsOptional()
  profile?: UpdateUserProfileDto;
}
