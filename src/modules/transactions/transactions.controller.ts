import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { InitializeTransactionDto } from './dto/initialize-transaction.dto';
import { PaystackCallbackDto, PaystackWebhookDto } from './dto/paystack.dto';
import { TransactionsService } from './transactions.service';
import { Transaction } from '@prisma/client';
import { PAYSTACK_WEBHOOK_SIGNATURE_KEY } from 'src/common/constants';
import { User } from 'src/common/decorators/param-decorator/User.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/initialize')
  async initializeTransaction(@Body() dto: InitializeTransactionDto, @User('userId') userId: string) {
    return await this.transactionsService.initializeTransaction(dto, userId);
  }

  @Get('/callback')
  async verifyTransaction(
    @Query() query: PaystackCallbackDto,
  ): Promise<Transaction> {
    return await this.transactionsService.verifyTransaction(query);
  }

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async paymentWebhookHandler(
    @Body() dto: PaystackWebhookDto,
    @Headers() headers = {},
  ) {
    const result = await this.transactionsService.handlePaystackWebhook(
      dto,
      `${headers[PAYSTACK_WEBHOOK_SIGNATURE_KEY]}`,
    );

    if (!result) {
      throw new BadRequestException();
    }
  }

  @Get()
  async findTransactions() {
    return await this.transactionsService.findMany();
  }
}
