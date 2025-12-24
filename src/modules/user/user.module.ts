import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./user.controller";
import { UsersService } from "./user.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuditLog } from "src/auditlog/audit-log.entity";
import { S3Service } from "src/services/aws.s3.service";
import { User } from "src/entities/user.entity";
import { User_Role } from "src/entities/user_role.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([User_Role, JwtService, AuditLog]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {},
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, S3Service],
})
export class UsersModule {}
