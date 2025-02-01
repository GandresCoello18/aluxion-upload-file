import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EnumGenderUser } from './user.model';

@Entity()
export class User {
  @PrimaryColumn({
    length: 50,
    comment: 'Password of the user',
  })
  idUser: string;

  @Column({
    length: 50,
    comment: 'Name of the user',
  })
  name: string;

  @Column({
    length: 50,
    comment: 'Last name of the user',
  })
  lastName: string;

  @Column({
    length: 150,
    comment: 'Email of the user',
  })
  email: string;

  @Column({
    length: 150,
    comment: 'Password of the user',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: EnumGenderUser,
    nullable: false,
    comment: 'Gender of the user',
    default: null,
  })
  gender: EnumGenderUser | null;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'Date of creation',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Date of last update',
  })
  updatedAt: Date;
}
