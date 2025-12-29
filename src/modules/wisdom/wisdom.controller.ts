import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import { WisdomService } from "./wisdom.service";
import { CreateWisdomDto } from "./dto/create-wisdom.dto";
import { UpdateWisdomDto } from "./dto/update-wisdom.dto";
import { RolesGuard } from "src/guard/role.guard";
import { JwtAuthGuard } from "src/guard/jwt.guard";
import { UserRole } from "src/utils/constant";
import { Roles } from "src/decorators/roles.decorators";
import { logger } from "src/logger/winston.logger";
import { WISDOM_ADD_SUCCESS } from "src/utils/message";

@Controller("wisdom")
export class WisdomController {
  constructor(private readonly wisdomService: WisdomService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post("")
  async addWisdom(@Body() createWisdomDto: CreateWisdomDto) {
    try {
      await this.wisdomService.addWisdom(createWisdomDto);
      return {
        statusCode: HttpStatus.OK,
        message: WISDOM_ADD_SUCCESS,
        data: [],
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
