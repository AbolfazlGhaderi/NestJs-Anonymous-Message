import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"text",nullable:false})
    text:string

    @CreateDateColumn()
    postage_date:Date

    @ManyToOne(() => UserEntity ,(user) => user.messages,{onDelete:'CASCADE',nullable:false})
    user:UserEntity
}
