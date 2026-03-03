import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { Sub_Module } from "./sub_module.entity";
import { Role_Module } from "./role_module.entity";

@Entity()
export class Module {
  @PrimaryGeneratedColumn("uuid")
  module_id: string;

  @Column()
  name: string;

  @OneToMany(() => Sub_Module, (sub_module) => sub_module.module, {
    cascade: true,
  })
  sub_modules: Sub_Module[];

  @OneToMany(() => Role_Module, (role_module) => role_module.module, {
    cascade: true,
  })
  roles: Role_Module[];

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
