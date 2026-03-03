import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateWisdomDto } from "./dto/create-wisdom.dto";
import { UpdateWisdomDto } from "./dto/update-wisdom.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Wisdom } from "src/entities/wisdom.entity";
import { Repository } from "typeorm";
import { WISDOM_NOT_FOUND } from "src/utils/message";

@Injectable()
export class WisdomService {
  constructor(
    @InjectRepository(Wisdom)
    private wisdomRepository: Repository<Wisdom>
  ) {}

  async addWisdom(createWisdomDto: CreateWisdomDto) {
    const newWisdom = this.wisdomRepository.create(createWisdomDto);
    return await this.wisdomRepository.save(newWisdom);
  }

  async findOne(id: string) {
    const wisdom = await this.wisdomRepository.findOne({
      where: { wisdom_id: id },
    });

    if (!wisdom) {
      throw new HttpException(WISDOM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return wisdom;
  }

  async updateWisdom(id: string, updateWisdomDto: UpdateWisdomDto) {
    const wisdom = await this.wisdomRepository.findOne({
      where: { wisdom_id: id },
    });

    if (!wisdom) {
      throw new HttpException(WISDOM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (updateWisdomDto.description) wisdom.description = updateWisdomDto.description;
    if (updateWisdomDto.written_by) wisdom.written_by = updateWisdomDto.written_by;

    await this.wisdomRepository.save(wisdom);
  }

  async wisdomList(page: number = 1, limit: number = 10, pagination: any) {
    pagination = pagination === "true" ? true : false;

    if (pagination) {
      const [data, total] = await this.wisdomRepository.findAndCount({
        skip: (page - 1) * limit,
        order: { created_at: "DESC" },
        take: limit,
      });

      return {
        data,
        totalCount: total,
        page,
        limit,
      };
    } else {
      return await this.wisdomRepository.find({
        order: { created_at: "DESC" },
      });
    }
  }

  async deleteWisdom(id: string) {
    const wisdom = await this.wisdomRepository.findOne({where: { wisdom_id: id },});

    if (!wisdom) {
      throw new HttpException(WISDOM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this.wisdomRepository.softDelete(id);
  }
}