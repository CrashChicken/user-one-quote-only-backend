import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Vote, (vote) => vote.quote)
  votes: Vote[];
}
