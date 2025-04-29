import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { UpdateSponsorshipRequestDto } from 'src/modules/guardian/dto/create-sponsorship-request.dto';
import { UpdateOrphanDto } from 'src/modules/orphan/dto/update-orphan.dto';
import {
  OrphanSnapshotDto,
  SponsorshipRequestSnapshotDto,
} from './snapshot.dto';

export class ActionDto {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(OrphanSnapshotDto) },
      { $ref: getSchemaPath(SponsorshipRequestSnapshotDto) },
      undefined,
    ],
    description: 'A snapshot of the entity',
    required: false,
  })
  snapshot?: OrphanSnapshotDto | SponsorshipRequestSnapshotDto;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(UpdateOrphanDto) },
      { $ref: getSchemaPath(UpdateSponsorshipRequestDto) },
      undefined,
    ],
    description: 'The change payload for the entity.',
    required: false,
  })
  change?: UpdateOrphanDto | UpdateSponsorshipRequestDto;

  @ApiProperty({
    example: 'I am performing this action because...',
    description: 'Comment for action',
    required: false,
  })
  comment?: string;
}
