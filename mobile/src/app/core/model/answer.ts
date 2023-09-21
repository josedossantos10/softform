export interface Answer {
  userId: string;
  questionId: number;
  answer: string;
  monitoring: boolean;
  answeredAt: Date;
}
