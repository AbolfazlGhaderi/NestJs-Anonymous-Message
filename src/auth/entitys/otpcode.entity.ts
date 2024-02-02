import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("otpcode")
export class OtpCodeEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    email:string

    @Column({nullable:false})
    code:string
  
    @CreateDateColumn()
    create_at:Date

    @UpdateDateColumn()
    update_at:Date

    @Column({default:false})
    is_used:boolean

}