import { Verification_Status } from "../utils/constant";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  DeleteDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { User_Role } from "../entities/user_role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column({ nullable: true, length: 50 })
  first_name: string;

  @Column({ nullable: true, length: 50 })
  last_name: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column({ nullable: true })
  access_token?: string;

  @Column({ nullable: true })
  fcm_token?: string;

  @Column({ nullable: true })
  platform?: string;

  @Column({ nullable: true })
  qr_url?: string;

  @Index({ unique: true })
  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true, unique: true })
  phone_no?: string;

  @Column({ nullable: true, default: false })
  is_main_org_user: boolean;

  @Column({
    type: "enum",
    enum: Verification_Status,
    nullable: true,
    default: Verification_Status.PENDING,
  })
  verification: Verification_Status;

  @Column({ default: false })
  password_set: boolean;

  @Column({ default: false })
  is_online: boolean;

  @ManyToOne(() => User_Role, (user_role) => user_role.users, {
    cascade: true,
  })
  @JoinColumn()
  role: User_Role;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
