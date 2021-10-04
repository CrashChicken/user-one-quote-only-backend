import { Length } from 'class-validator';

export class QuoteReqDto {
  @Length(2, 400)
  quote: string;
}
