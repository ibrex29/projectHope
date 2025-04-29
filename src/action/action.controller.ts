import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Action } from '@prisma/client';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { ActionDto } from 'src/dto/action.dto';
import { Entity } from 'src/modules/guardian/dto/types.enum';
import { ActionService } from './action.service';

@ApiBearerAuth()
@ApiTags('Action')
@Controller({ path: 'action', version: '1' })
export class ActionController {
  constructor(private readonly actionService: ActionService) {}
  @Post()
  @ApiQuery({
    name: 'entityId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'entity',
    enum: Entity,
    required: true,
  })
  @ApiQuery({
    name: 'action',
    enum: Action,
    required: true,
  })
  @ApiBody({ type: ActionDto, required: false })
  async action(
    @Query('action') action: Action,
    @Query('entity') entity: Entity,
    @User('userId') userId: string,
    @Query('entityId') entityId?: string,
    @Body() dto?: ActionDto,
  ) {
    return this.actionService.performAction(
      entityId,
      userId,
      action,
      entity,
      dto?.comment,
      dto?.snapshot,
      dto?.change,
    );
  }
}
