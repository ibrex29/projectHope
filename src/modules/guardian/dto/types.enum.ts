export enum SponsorshipStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CLOSED = "closed",
    DRAFT = "draft",
  }
  
  export enum ActionType {
    PUBLISH_SPONSORSHIP_REQUEST = "PUBLISH_SPONSORSHIP_REQUEST",
    APPROVE_SPONSORSHIP_REQUEST = "APPROVE_SPONSORSHIP_REQUEST",
    REJECT_SPONSORSHIP_REQUEST = "REJECT_SPONSORSHIP_REQUEST",
    CLOSE_SPONSORSHIP_REQUEST = "CLOSE_SPONSORSHIP_REQUEST",
    UPDATE_SPONSORSHIP_REQUEST = "UPDATE_SPONSORSHIP_REQUEST",
  }
  export enum PaymentStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed"
  }