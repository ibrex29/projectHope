import { Module } from '@nestjs/common';
import { GuardianService } from 'src/modules/guardian/guardian.service';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';

@Module({
  providers: [ActionService, GuardianService],
  controllers: [ActionController],
})
export class ActionModule {}
