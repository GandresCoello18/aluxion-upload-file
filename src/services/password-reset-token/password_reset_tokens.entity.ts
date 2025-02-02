import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryColumn({
    comment: 'Reset token ID',
    length: 50,
  })
  idResetToken: string;

  @Column({
    length: 70,
    comment: 'Reset token',
  })
  token: string;

  @Column({
    comment: 'Expiration date',
  })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.passwordResetTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    length: 50,
    comment: 'User ID',
  })
  userId: string;
}
