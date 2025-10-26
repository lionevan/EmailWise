export type EmailCategory =
  | 'Personal'
  | 'Work'
  | 'Social'
  | 'Promotions'
  | 'Updates'
  | 'Other';

export interface Email {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  body: string;
  read: boolean;
  category?: EmailCategory;
  date: string;
}
