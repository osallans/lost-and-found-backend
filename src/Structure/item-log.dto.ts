export interface ItemLogDTO {
  id?: string;
  itemId: string;
  action: string;
  actorId: string;
  actorRole: 'admin' | 'user';
  logType?: string;
  notes?: string;
  createdAt?: Date;
}