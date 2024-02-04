import { MessageEntity } from 'src/messages/entities/message..entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @CreateDateColumn()
  create_at:Date

  @UpdateDateColumn()
  update_at:Date

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages : MessageEntity[]
}
