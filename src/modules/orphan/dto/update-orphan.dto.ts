import { PartialType } from '@nestjs/swagger';
import { CreateOrphanDto } from './create-orphan.dto';

export class UpdateOrphanDto extends PartialType(CreateOrphanDto) {}
