import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column({})
    name:string

    @Column({type:"text"})
    text:string

    @ManyToOne(() => UserEntity ,(user) => user.messages,{onDelete:'CASCADE'})
    user:UserEntity
}
