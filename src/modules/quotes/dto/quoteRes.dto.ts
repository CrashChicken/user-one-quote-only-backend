import { UserResDto } from '../../users/dto/userRes.dto';

export class QuoteResDto {
  id: number;
  quote: string;
  karma: string;
  createdAt: string;
  updatedAt: string;
  user: UserResDto;
}
