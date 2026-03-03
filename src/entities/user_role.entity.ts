import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { Role_Module } from "./role_module.entity";
import { User } from "./user.entity";
import { Role_Sub_Module } from "./role_submodule.entity";

@Entity()
export class User_Role {
  @PrimaryGeneratedColumn("uuid")
  role_id: string;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.role, {
    onDelete: "CASCADE",
  })
  users: User[];

  @OneToMany(() => Role_Module, (role_module) => role_module.role, {
    cascade: true,
  })
  modules: Role_Module[];

  @OneToMany(() => Role_Sub_Module, (role_sub_module) => role_sub_module.role, {
    cascade: true,
  })
  sub_modules: Role_Sub_Module[];

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
