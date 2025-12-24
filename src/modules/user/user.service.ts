import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createuser.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { S3Service } from "src/services/aws.s3.service";
import { User_Role } from "src/entities/user_role.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(User_Role)
    private userRole: Repository<User_Role>,
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
    private s3Service: S3Service
  ) {}

  async createUser(user: CreateUserDto, org_user: any): Promise<any> {}
}
