export interface ItemDTO {
  id?: string;
  facilityId: string;
  reportedBy: string;
  title: string;
  description?: string;
  status: 'lost' | 'found' | 'matched' | 'claimed' | 'returned';
  category?: string;
  reportedAt: Date;
  resolvedAt?: Date;
  matchedItemId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
}