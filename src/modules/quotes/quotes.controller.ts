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
import { Quote } from '../../entities/quote.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuoteReqDto } from './dto/quoteReq.dto';
import { QuoteResDto } from './dto/quoteRes.dto';
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
  createMyQuote(@Request() req, @Body() body: QuoteReqDto): Promise<Quote> {
    return this.quotesService.createQuote(req.user.userId, body.quote);
  }

  @UseGuards(JwtAuthGuard)
  @Put('myquote')
  updateMyQuote(@Request() req, @Body() body: QuoteReqDto): Promise<Quote> {
    return this.quotesService.updateQuote(req.user.userId, body.quote);
  }

  @Get('/user/:userId')
  getUserQuote(@Param('userId') userId: number): Promise<any> {
    return this.quotesService.getUserInfo(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/user/:userId/upvote')
  upvoteQuote(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<QuoteResDto> {
    return this.quotesService.upvoteQuote(req.user.userId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/user/:userId/downvote')
  downvoteQuote(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<QuoteResDto> {
    return this.quotesService.downvoteQuote(req.user.userId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/user/:userId/vote')
  deleteVote(
    @Request() req,
    @Param('userId') userId: number,
  ): Promise<QuoteResDto> {
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
