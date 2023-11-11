export interface Form {
  id: number;
  user_id: string;
  name: string;
  description: string;
  content: [];
  visits: number;
  submissions: string[];
  published: boolean;
  shareUrl: string;
  created_at: Date;
  updated_at: Date;
}
