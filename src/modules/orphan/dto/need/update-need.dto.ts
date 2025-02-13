import { PartialType } from '@nestjs/mapped-types';
import { CreateNeedDto } from './create-need.dto';

export class UpdateNeedDto extends PartialType(CreateNeedDto) {}
