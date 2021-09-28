import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from 'src/entities/quote.entity';
import { Vote } from 'src/entities/vote.entity';
import { DeleteResult, getManager, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { QuoteResponseDto } from './dto/quoteResponse.dto';
import { VoteCheckDto } from './dto/voteCheck.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote) private quotesRepository: Repository<Quote>,
    @InjectRepository(Vote) private votesRepository: Repository<Vote>,
    private usersService: UsersService,
  ) {}

  formatQuoteResponse(list: any[]): QuoteResponseDto[] {
    let result = [];
    list.forEach((element) => {
      result.push({
        id: element.quoteid,
        quote: element.quote,
        karma: element.karma == null ? 0 : parseInt(element.karma),
        createdAt: element.createdAt,
        user: {
          id: element.userid,
          username: element.username,
          firstName: element.firstName,
          lastName: element.lastName,
        },
      });
    });
    return result;
  }

  async getQuoteByUserId(userId: number): Promise<Quote> {
    return this.quotesRepository
      .findOneOrFail({ where: { user: userId } })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async createQuote(userId: number, quote: string): Promise<Quote> {
    const user = await this.usersService.getUserById(userId);
    const newQuote = this.quotesRepository.create({ user: user, quote: quote });
    const result = await this.quotesRepository.save(newQuote).catch((err) => {
      if (err.code === '23505') throw new ConflictException();
      throw new BadRequestException();
    });
    delete result.user;
    return result;
  }

  async updateQuote(userId: number, newQuote: string): Promise<Quote> {
    const quote = await this.getQuoteByUserId(userId);
    quote.quote = newQuote;
    return this.quotesRepository.save(quote).catch((err) => {
      throw new BadRequestException();
    });
  }

  async getQuoteVoteSum(userId: number): Promise<any> {
    await this.getQuoteByUserId(userId);
    const userQuote = await getManager().query(
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", "user".id AS userId, "user".username, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id WHERE "user".id = $1 GROUP BY "user".id, quote.id ORDER BY karma',
      [userId],
    );

    const userVotes = await getManager().query(
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", "user".id AS userId, "user".username, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id WHERE vote."userId" = $1 GROUP BY "user".id, quote.id ORDER BY karma',
      [userId],
    );
    const result = {
      quote: this.formatQuoteResponse(userQuote)[0],
      votes: this.formatQuoteResponse(userVotes),
    };
    return result;
  }

  async voteQuote(
    voteUserId: number,
    quoteUserId: number,
    vote: number,
  ): Promise<QuoteResponseDto> {
    const quote = await this.getQuoteByUserId(quoteUserId);
    const user = await this.usersService.getUserById(voteUserId);
    const newVote = this.votesRepository.create({
      quote: quote,
      user: user,
      vote: vote,
    });
    const result = await this.votesRepository.save(newVote).catch((err) => {
      if (err.code === '23505') throw new ConflictException();
      throw new BadRequestException();
    });
    delete result.user.password;

    const userQuote = await getManager().query(
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", "user".id AS userId, "user".username, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id WHERE "user".id = $1 GROUP BY "user".id, quote.id ORDER BY karma',
      [quoteUserId],
    );

    return this.formatQuoteResponse(userQuote)[0];
  }

  upvoteQuote(
    voteUserId: number,
    quoteUserId: number,
  ): Promise<QuoteResponseDto> {
    return this.voteQuote(voteUserId, quoteUserId, 1);
  }

  downvoteQuote(
    voteUserId: number,
    quoteUserId: number,
  ): Promise<QuoteResponseDto> {
    return this.voteQuote(voteUserId, quoteUserId, -1);
  }

  async voteCheck(
    voteUserId: number,
    quoteUserId: number,
  ): Promise<VoteCheckDto> {
    const list: any[] = await getManager().query(
      'SELECT quote."userId", vote.vote FROM vote LEFT JOIN quote ON quote.id = vote."quoteId" WHERE quote."userId" = $1 AND vote."userId" = $2',
      [quoteUserId, voteUserId],
    );
    if (list.length == 0)
      return {
        userId: +quoteUserId,
        vote: 0,
      };
    return list[0];
  }

  async deleteVote(
    voteUserId: number,
    quoteUserId: number,
  ): Promise<QuoteResponseDto> {
    const quote = await this.getQuoteByUserId(quoteUserId);
    const user = await this.usersService.getUserById(voteUserId);
    await this.votesRepository.delete({ quote, user });

    const userQuote = await getManager().query(
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", "user".id AS userId, "user".username, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id WHERE "user".id = $1 GROUP BY "user".id, quote.id ORDER BY karma',
      [quoteUserId],
    );

    return this.formatQuoteResponse(userQuote)[0];
  }

  async listQuoteVoteSum(query): Promise<QuoteResponseDto[]> {
    let sort = 'karma';
    //if (query.sort === 'newest') sort = 'quote."createdAt"';

    const list = await getManager().query(
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", "user".id AS userId, "user".username, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id GROUP BY "user".id, quote.id ORDER BY karma DESC',
    );
    return this.formatQuoteResponse(list);
  }
}
