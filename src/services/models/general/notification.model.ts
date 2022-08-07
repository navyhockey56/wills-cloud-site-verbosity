export enum MessageCategory {
  ERROR,
  WARN,
  INFO,
  SUCCESS
}

export interface NotificationModel {
  message: string;
  messageCategory: MessageCategory;
  timeout?: number;
  id?: number;
}
