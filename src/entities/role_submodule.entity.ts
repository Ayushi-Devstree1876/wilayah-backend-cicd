import { User_Role } from "../entities/user_role.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";
import { Sub_Module } from "../entities/sub_module.entity";

@Entity()
export class Role_Sub_Module {
  @PrimaryGeneratedColumn("uuid")
  role_sub_module_id: string;

  @ManyToOne(() => User_Role, (role) => role.sub_modules, {
    onDelete: "CASCADE",
  })
  role: User_Role;

  @ManyToOne(() => Sub_Module, (sub_module) => sub_module.roles, {
    onDelete: "CASCADE",
  })
  sub_module: Sub_Module;

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
