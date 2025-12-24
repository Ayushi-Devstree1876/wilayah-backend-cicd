// src/seeds/seeds.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSeed } from "./user.seed";
import * as bcryptjs from "bcryptjs";
import { salting_rounds, UserRole } from "src/helper/constant";
import { User_Role } from "src/entities/user_role.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(User_Role)
    private readonly userRole: Repository<User_Role>
  ) {}

  async seedUsers(): Promise<void> {
    try {
      const password = await bcryptjs.hash(UserSeed.password, salting_rounds);
      UserSeed.password = password;

      const role = await this.userRole.findOne({
        where: { name: UserRole.ADMIN },
      });
      UserSeed.role = role;
      await this.userRepository.save(UserSeed);
      console.log("Admin user seeded");
    } catch (error) {
      console.log("Already seeded");
    }
  }

  async seedAll(): Promise<void> {
    await this.seedUsers();
  }
}
