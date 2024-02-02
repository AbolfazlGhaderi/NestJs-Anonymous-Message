import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("otpcode")
export class OtpLogin {
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    email:string

    @Column({nullable:false})
    code:string
  
    @CreateDateColumn()
    create_at:Date

    @Column({default:false})
    is_used:boolean

}