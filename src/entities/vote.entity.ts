import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Quote } from './quote.entity';
import { User } from './user.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @ManyToOne(() => Quote, (quote) => quote.votes)
  quote: Quote;

  @Column({ type: 'smallint' })
  upvote: number;
}
