import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Quote } from './quote.entity';
import { User } from './user.entity';

@Entity()
export class Vote {
  //@PrimaryGeneratedColumn()
  //id: number;

  @ManyToOne(() => User, (user) => user.votes, { primary: true })
  user: User;

  @ManyToOne(() => Quote, (quote) => quote.votes, { primary: true })
  quote: Quote;

  @Column({ type: 'smallint' })
  vote: number;
}
