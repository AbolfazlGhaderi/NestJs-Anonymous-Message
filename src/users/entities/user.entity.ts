import { MessageEntity } from 'src/messages/entities/message..entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @OneToMany(() => MessageEntity, (message) => message.user)
  messages : MessageEntity
}
