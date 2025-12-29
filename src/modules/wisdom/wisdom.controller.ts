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
  Query,
  ParseUUIDPipe,
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

//  @UseGuards(JwtAuthGuard, RolesGuard)
//  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMINISTRATOR)
  @Post("add")
  async addWisdom(@Body() createWisdomDto: CreateWisdomDto) {
    try {
      const wisdom = await this.wisdomService.addWisdom(createWisdomDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: WISDOM_ADD_SUCCESS,
        data: wisdom,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Get("list")
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("search") search?: string
  ) {
    try {
      const result = await this.wisdomService.findAll(Number(page), Number(limit), search);
      return {
        statusCode: HttpStatus.OK,
        message: "Wisdom list retrieved successfully",
        data: result,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      const wisdom = await this.wisdomService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        message: "Wisdom retrieved successfully",
        data: wisdom,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Patch(":id")
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateWisdomDto: UpdateWisdomDto
  ) {
    try {
      const updated = await this.wisdomService.updateWisdom(id, updateWisdomDto);
      return {
        statusCode: HttpStatus.OK,
        message: "Wisdom updated successfully",
        data: updated,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  @Delete(":id")
  async remove(@Param("id", new ParseUUIDPipe()) id: string) {
    try {
      await this.wisdomService.deleteWisdom(id);
      return {
        statusCode: HttpStatus.OK,
        message: "Wisdom deleted successfully",
        data: [],
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

