import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Quote } from './quote.entity';
import { Vote } from './vote.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @OneToOne(() => Quote, (quote) => quote.user)
  quote: Quote;

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
