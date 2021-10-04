import {
  Entity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
