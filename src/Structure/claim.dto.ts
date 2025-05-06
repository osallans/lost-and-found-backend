export interface ClaimDTO {
  id?: string;
  itemId: string;
  claimantId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewedByAdminId?: string;
  claimToken?: string;
  attachmentUrl?: string;
  claimedAt?: Date;
  reviewedAt?: Date;
  expiresAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}