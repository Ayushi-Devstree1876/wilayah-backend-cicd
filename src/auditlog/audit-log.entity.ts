import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  log_id: string;

  @Column()
  action: string;

  @Column()
  message: string;

  @Column("json", { nullable: true })
  newValue: Record<string, any>;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  perform_user_id: string;

  @Column({ nullable: true, default: "self" })
  perform_by: string;

  @Column({ nullable: true })
  role: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  timestamp: Date;
}
