import { Controller, Get, Post, Body,  Req, Res, Query, Headers} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { InitializePaymentDto } from "../guardian/dto/initialize-payment.dto";
import { SponsorService } from "./sponsor.service";
import { PaymentService } from "./payment.service";
import { User } from 'src/common/decorators/param-decorator/User.decorator';


@ApiTags("sponsor")
@ApiBearerAuth()
@Controller({ path: 'sponsor', version: '1' })
export class SponsorController {
  constructor
      (private readonly sponsorService: SponsorService,
      private readonly paymentService: PaymentService,
  ) {}

  @Post('Donate')
  @ApiTags('donations')
  async initializePayment(@Body() body: InitializePaymentDto,@User('email')email:string) {
      return await this.paymentService.initializePayment(
          body.amount,
          email,
          body.donationId,
      );
  }

  @Get('verify')
  @ApiTags('donations')
  async verifyPayment(@Query('reference') reference: string) {
    return await this.paymentService.verifyPayment(reference);
  }

  // @Post('webhook')
  // @ApiTags('donations')
  // async handleWebhook(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Headers('x-paystack-signature') signature: string,
  // ) {
  //   try {
  //     await this.paymentService.handleWebhook(req.body, signature);
  //     res.sendStatus(200);
  //   } catch (error) {
  //     res.status(400).json({ message: 'Webhook processing failed' });
  //   }
  // }



}