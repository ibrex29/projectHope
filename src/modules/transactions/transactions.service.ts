import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { createHmac, timingSafeEqual } from 'crypto';
import { InitializeTransactionDto } from './dto/initialize-transaction.dto';
import {
  // PaymentStatus,
  PaystackCallbackDto,
  PaystackCreateTransactionDto,
  PaystackCreateTransactionResponseDto,
  PaystackMetadata,
  PaystackVerifyTransactionResponseDto,
  PaystackWebhookDto,
} from './dto/paystack.dto';
import { PAYSTACK_TRANSACTION_INI_URL, PAYSTACK_TRANSACTION_VERIFY_BASE_URL, PAYSTACK_SUCCESS_STATUS, PAYSTACK_WEBHOOK_CRYPTO_ALGO } from 'src/common/constants';
import { PrismaService } from 'prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) { }

  async initializeTransaction(dto: InitializeTransactionDto,userId: string) {
    const { sponsorshipRequestId } = dto;

    const sponsorshipRequest = await this.prisma.sponsorshipRequest.findUnique({
      where: { id: sponsorshipRequestId },
      include: {
        createdBy: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!sponsorshipRequest || !sponsorshipRequest.createdBy.email) return null;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    }); 
  
    if (!user || !user.email || !user.profile) return null;
  
    const metadata: PaystackMetadata = {
      user_id: userId,
      product_id: sponsorshipRequest.id,
      custom_fields: [
        {
          display_name: 'Name',
          variable_name: 'name',
          value: user.email,
        },
        {
          display_name: 'Email',
          variable_name: 'email',
          value: user.profile.firstName,
        },
      ],
    };

    const paystackCreateTransactionDto: PaystackCreateTransactionDto = {
      email: user.email,
      amount: dto.amount * 100,
      metadata,
    };

    const paystackCallbackUrl = this.configService.get('PAYSTACK_CALLBACK_URL');
    if (paystackCallbackUrl) {
      paystackCreateTransactionDto.callback_url = paystackCallbackUrl;
    }

    const payload = JSON.stringify(paystackCreateTransactionDto);

    let result: PaystackCreateTransactionResponseDto;

    try {
      const response = await axios.post<PaystackCreateTransactionResponseDto>(
        PAYSTACK_TRANSACTION_INI_URL,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      result = response.data;
    } catch (error) {
      return null;
    }

    if (!result?.status) return null;

    const data = result.data;

    return await this.prisma.transaction.create({
      data: {
        transactionReference: data.reference,
        paymentLink: data.authorization_url,
        sponsorshipRequestId: sponsorshipRequest.id,
        userId: user.id,
      },
    });
  }


  async verifyTransaction(dto: PaystackCallbackDto) {
    if (!dto.reference) {
      throw new BadRequestException('Transaction reference is required.');
    }
  
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionReference: dto.reference },
    });
  
    if (!transaction) return null;
  
    const url = `${PAYSTACK_TRANSACTION_VERIFY_BASE_URL}/${dto.reference}`;
  
    let transactionStatus: string;
  
    try {
      const response = await axios.get<PaystackVerifyTransactionResponseDto>(url, {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
        },
      });
  
      transactionStatus = response.data.data.status;
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return null;
    }
  
    const paymentConfirmed = transactionStatus === PAYSTACK_SUCCESS_STATUS;
  
    return await this.prisma.transaction.update({
      where: { transactionReference: dto.reference },
      data: {
        transactionStatus,
        status: { set: paymentConfirmed ? PaymentStatus.paid : PaymentStatus.notPaid },
      },
    });
  }

  async handlePaystackWebhook(dto: PaystackWebhookDto, signature: string): Promise<boolean> {
    if (!dto.data) return false;

    let isValidEvent = false;

    try {
      const hash = createHmac(
        PAYSTACK_WEBHOOK_CRYPTO_ALGO,
        this.configService.get<string>('PAYSTACK_SECRET_KEY'),
      )
        .update(JSON.stringify(dto))
        .digest('hex');

      isValidEvent = hash && signature &&
        timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
    } catch (error) {
      return false;
    }

    if (!isValidEvent) return false;

    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionReference: dto.data.reference },
    });

    if (!transaction) return false;

    const transactionStatus = dto.data.status;
    const paymentConfirmed = transactionStatus === PAYSTACK_SUCCESS_STATUS;

    await this.prisma.transaction.update({
      where: { transactionReference: dto.data.reference },
      data: {
        transactionStatus,
        status: paymentConfirmed ? PaymentStatus.paid : PaymentStatus.notPaid,
      },
    });

    return true;
  }

  async findMany() {
    return await this.prisma.transaction.findMany();
  }
}
