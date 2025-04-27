import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'prisma/prisma.service';
import { PaymentStatus } from '../guardian/dto/types.enum';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

  constructor(private prisma: PrismaService) {}

  //   async initializePayment(amount: number, email: string, donationId: string) {
  //     try {
  //       const reference = uuidv4(); // Generate unique transaction reference
  //       const response = await axios.post(
  //         'https://api.paystack.co/transaction/initialize',
  //         { amount: amount * 100, email, reference },
  //         { headers: { Authorization: `Bearer ${this.PAYSTACK_SECRET}` } },
  //       );

  //       // Store transaction reference in the donation record
  //       await this.prisma.donationRequest.update({
  //         where: { id: donationId },
  //         data: { transactionReference: reference, paymentStatus: PaymentStatus.PENDING},
  //       });

  //       return response.data;
  //     } catch (error) {
  //       throw new HttpException(
  //         'Payment initialization failed',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }
  //   }

  async initializePayment(
    amount: number,
    email: string,
    sponsorshipId: string,
  ) {
    try {
      const reference = uuidv4(); // Generate unique transaction reference

      // Step 1: Ensure the sponsorship request exists
      const sponsorship = await this.prisma.sponsorshipRequest.findUnique({
        where: { id: sponsorshipId },
      });

      if (!sponsorship) {
        throw new HttpException(
          'Sponsorship request not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Step 2: Create a new donation request record
      const donation = await this.prisma.donationRequest.create({
        data: {
          sponsorshipId, // Linking donation to sponsorship
          amountDonated: amount,
          //   email,
          transactionReference: reference,
          paymentStatus: PaymentStatus.PENDING, // Enum or string
        },
      });

      // Step 3: Send request to Paystack
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        { amount: amount * 100, email, reference },
        {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        'Payment initialization error:',
        error.response?.data || error.message,
      );

      throw new HttpException(
        error.response?.data?.message || 'Payment initialization failed',
        error.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPayment(reference: string) {
    console.log('Starting verification for:', reference); // ✅ Checkpoint 1

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.PAYSTACK_SECRET}`,
          },
        },
      );

      console.log('Paystack Response:', response.data); // ✅ Checkpoint 2

      if (!response.data || !response.data.data) {
        console.log('Invalid response from Paystack'); // ✅ Checkpoint 3
        throw new HttpException(
          'Invalid response from Paystack',
          HttpStatus.BAD_REQUEST,
        );
      }

      const paymentData = response.data.data;

      // ✅ Log transaction details from Paystack
      console.log('Transaction Status:', paymentData.status);
      console.log('Transaction Reference:', paymentData.reference);

      // ✅ Check if the reference exists in your database
      const existingDonation = await this.prisma.donationRequest.findUnique({
        where: { transactionReference: reference },
      });

      if (!existingDonation) {
        console.log('No donation found for this reference:', reference);
        throw new HttpException(
          'Transaction reference not found',
          HttpStatus.NOT_FOUND,
        );
      }

      console.log('Updating donation record...');

      const paymentStatus =
        paymentData.status === 'success'
          ? PaymentStatus.SUCCESS
          : PaymentStatus.FAILED;

      await this.prisma.donationRequest.update({
        where: { transactionReference: reference },
        data: { paymentStatus },
      });

      console.log('Updated payment status to:', paymentStatus); // ✅ Checkpoint 4

      return { message: `Payment ${paymentStatus}`, data: paymentData };
    } catch (error) {
      console.error(
        'Verification error:',
        error.response?.data || error.message,
      );

      throw new HttpException(
        error.response?.data?.message || 'Verification failed',
        error.response?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleWebhook(payload: any, signature: string) {
    const secret = this.PAYSTACK_SECRET;

    const expectedSignature = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (payload.event === 'charge.success') {
      await this.verifyPayment(payload.data.reference);
    }
  }
}
