import { Answer } from './answer';
import { Alternative } from './alternative';

export interface Question {
  id: number;
  order: number;
  question: string;
  questionType: string;
  monitoring: boolean;
  alternatives: Alternative[];
  answer: Answer;
  jumpAlternative?: string | number;
  jumpToQuestionId?: number;
}
