import { Module } from "./module.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import { Role_Sub_Module } from "./role_submodule.entity";

@Entity()
export class Sub_Module {
  @PrimaryGeneratedColumn("uuid")
  sub_module_id: string;

  @Column()
  name: string;

  @ManyToOne(() => Module, (module) => module.sub_modules, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  module: Module;

  @OneToMany(
    () => Role_Sub_Module,
    (role_sub_module) => role_sub_module.sub_module,
    {
      cascade: true,
    }
  )
  roles: Role_Sub_Module[];

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
