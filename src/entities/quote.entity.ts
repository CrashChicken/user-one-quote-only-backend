import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Vote } from './vote.entity';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.quote)
  @JoinColumn()
  user: User;

  @Column({ type: 'text' })
  quote: string;

  @OneToMany(() => Vote, (vote) => vote.quote)
  votes: Vote[];
}
