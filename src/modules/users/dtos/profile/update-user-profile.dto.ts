import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-user-profile.dto';

export class UpdateUserProfileDto extends PartialType(CreateProfileDto) {}
