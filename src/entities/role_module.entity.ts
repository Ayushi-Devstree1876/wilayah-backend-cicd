import { User_Role } from "./user_role.entity";
import { Module } from "./module.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class Role_Module {
  @PrimaryGeneratedColumn("uuid")
  role_module_id: string;

  @ManyToOne(() => User_Role, (role) => role.modules, { onDelete: "CASCADE" })
  role: User_Role;

  @ManyToOne(() => Module, (module) => module.roles, {
    onDelete: "CASCADE",
  })
  module: Module;

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
