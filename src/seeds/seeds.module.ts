import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SeedsService } from "./seeds.service";
import { User_Role } from "src/entities/user_role.entity";
import { User } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, User_Role])],
  providers: [SeedsService],
})
export class SeedModule {}
