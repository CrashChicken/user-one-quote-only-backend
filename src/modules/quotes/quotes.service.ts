import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../..//entities/quote.entity';
import { Vote } from '../../entities/vote.entity';
import { getManager, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { QuoteResDto } from './dto/quoteRes.dto';
import { VoteCheckDto } from './dto/voteCheck.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote) private quotesRepository: Repository<Quote>,
    @InjectRepository(Vote) private votesRepository: Repository<Vote>,
    private usersService: UsersService,
  ) {}

  formatQuoteResponse(list: any[]): QuoteResDto[] {
    let result = [];
    list.forEach((element) => {
      result.push({
        id: element.quoteid,
        quote: element.quote,
        karma: element.karma == null ? 0 : parseInt(element.karma),
        createdAt: element.createdAt,
        updatedAt: element.updatedAt,
        user: {
          id: element.userid,
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

  async getQuoteVoteSum(userId: number): Promise<QuoteResDto> {
    const userQuote = await getManager().query(
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", quote."updatedAt", "user".id AS userId, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id WHERE "user".id = $1 GROUP BY "user".id, quote.id',
      [userId],
    );
    return this.formatQuoteResponse(userQuote)[0];
  }

  async getLikes(userId: number) {
    const getUserLikes = await getManager().query(
      'SELECT quote."userId" FROM vote JOIN quote ON vote."quoteId" = quote.id WHERE vote."userId" = $1',
      [userId],
    );

    const result = await Promise.all(
      getUserLikes.map(async (value) => {
        return await this.getQuoteVoteSum(value.userId);
      }),
    );

    return result;
  }

  async getUserInfo(userId: number): Promise<any> {
    const user = await this.getQuoteByUserId(userId);

    const result = {
      quote: await this.getQuoteVoteSum(userId),
      votes: await this.getLikes(userId),
    };
    return result;
  }

  async voteQuote(
    voteUserId: number,
    quoteUserId: number,
    vote: number,
  ): Promise<QuoteResDto> {
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
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", quote."updatedAt", "user".id AS userId, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id WHERE "user".id = $1 GROUP BY "user".id, quote.id ORDER BY karma',
      [quoteUserId],
    );

    return this.formatQuoteResponse(userQuote)[0];
  }

  upvoteQuote(voteUserId: number, quoteUserId: number): Promise<QuoteResDto> {
    return this.voteQuote(voteUserId, quoteUserId, 1);
  }

  downvoteQuote(voteUserId: number, quoteUserId: number): Promise<QuoteResDto> {
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
  ): Promise<QuoteResDto> {
    const quote = await this.getQuoteByUserId(quoteUserId);
    const user = await this.usersService.getUserById(voteUserId);
    await this.votesRepository.delete({ quote, user });

    const userQuote = await getManager().query(
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", quote."updatedAt", quote."updatedAt", "user".id AS userId, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id WHERE "user".id = $1 GROUP BY "user".id, quote.id',
      [quoteUserId],
    );

    return this.formatQuoteResponse(userQuote)[0];
  }

  async listQuoteVoteSum(query): Promise<QuoteResDto[]> {
    let sort = 'karma';
    if (query.sort === 'newest') sort = 'quote."createdAt"';

    let page = Number(query.page);
    if (isNaN(page)) throw new BadRequestException();
    if (page <= 0) throw new BadRequestException();

    page = 9 * (page - 1);

    const list = await getManager().query(
      'SELECT quote.id AS quoteId, quote.quote, quote."createdAt", quote."updatedAt", "user".id AS userId, "user"."firstName", "user"."lastName", SUM(vote.vote) AS karma FROM quote LEFT JOIN vote ON quote.id = vote."quoteId" JOIN "user" ON quote."userId" = "user".id GROUP BY "user".id, quote.id ORDER BY ' +
        sort +
        ' DESC LIMIT 9 OFFSET $1',
      [page],
    );
    return this.formatQuoteResponse(list);
  }
}
