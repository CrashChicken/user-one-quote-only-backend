import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Quote } from 'src/entities/quote.entity';
import { Vote } from 'src/entities/vote.entity';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuoteRequestDto } from './dto/quoteRequest.dto';
import { QuoteResponseDto } from './dto/quoteResponse.dto';
import { VoteCheckDto } from './dto/voteCheck.dto';
import { QuotesService } from './quotes.service';

@Controller()
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('myquote')
  getMyQuote(@Request() req): Promise<Quote> {
    return this.quotesService.getQuoteByUserId(req.user.userId);
  }

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
  @Put('/user/:userId/upvote')
  upvoteQuote(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<QuoteResponseDto> {
    return this.quotesService.upvoteQuote(req.user.userId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/user/:userId/downvote')
  downvoteQuote(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<QuoteResponseDto> {
    return this.quotesService.downvoteQuote(req.user.userId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/user/:userId/vote')
  deleteVote(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<QuoteResponseDto> {
    return this.quotesService.deleteVote(req.user.userId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:userId/vote')
  voteCheck(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<VoteCheckDto> {
    return this.quotesService.voteCheck(req.user.userId, userId);
  }

  @Get('/list')
  getList(@Query() query): Promise<any> {
    return this.quotesService.listQuoteVoteSum(query);
  }
}
