import { IsNotEmpty } from 'class-validator';

export class QuoteRequestDto {
  @IsNotEmpty()
  quote: string;
}
