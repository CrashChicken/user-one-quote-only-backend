import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Quote } from 'src/entities/quote.entity';
import { Vote } from 'src/entities/vote.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuoteRequestDto } from './dto/quoteRequest.dto';
import { QuoteResponseDto } from './dto/quoteResponse.dto';
import { QuotesService } from './quotes.service';

@Controller()
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('myquote')
  createMyQuote(@Request() req, @Body() body: QuoteRequestDto): Promise<Quote> {
    return this.quotesService.createQuote(req.user.userId, body.quote);
  }

  @UseGuards(JwtAuthGuard)
  @Put('myquote')
  updateMyQuote(@Request() req, @Body() body: QuoteRequestDto): Promise<Quote> {
    return this.quotesService.updateQuote(req.user.userId, body.quote);
  }

  @Get('/user/:userId')
  getUserQuote(@Param('userId') userId: number): Promise<any> {
    return this.quotesService.getQuoteVoteSum(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId/upvote')
  upvoteQuote(@Request() req, @Param('userId') userId: number): Promise<Vote> {
    return this.quotesService.upvoteQuote(req.user.userId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId/downvote')
  downvoteQuote(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<Vote> {
    return this.quotesService.downvoteQuote(req.user.userId, userId);
  }

  @Get('/list')
  getList(): Promise<any> {
    return this.quotesService.listQuoteVoteSum();
  }
}
