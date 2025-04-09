import { IsString } from 'class-validator';

export class RejectOrphanDto {
  @IsString()
  reason: string;
}
