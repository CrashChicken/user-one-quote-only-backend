import { UserResponseDto } from '../../users/dto/userResponse.dto';

export class QuoteResponseDto {
  id: number;
  quote: string;
  karma: string;
  user: UserResponseDto;
}
