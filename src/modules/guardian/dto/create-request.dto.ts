export class CreateRequestDto {
  orphanId: string;
  status?: boolean;
  isApproved?: boolean;
  need: string[];
  description: string;
  amountNeeded: number;
  amountRecieved?: number;
}
