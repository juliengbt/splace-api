import { Exclude } from 'class-transformer';
import { UUIDTransformer } from 'src/transformers/uuid';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import User from '../user/entities/user.entity';

@Entity()
export default class Token {
  @Exclude()
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ foreignKeyConstraintName: 'fk_token_user' })
  user: User;

  @PrimaryColumn({
    name: 'userId',
    type: 'varbinary',
    length: 16,
    transformer: new UUIDTransformer()
  })
  userId: string;

  @Column({ type: 'datetime' })
  exp: Date;

  @Exclude()
  @PrimaryColumn({ type: 'varchar', length: 255, nullable: false })
  refreshTokenHash: string;
}
