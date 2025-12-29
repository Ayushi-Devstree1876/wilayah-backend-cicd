import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateWisdomDto } from "./dto/create-wisdom.dto";
import { UpdateWisdomDto } from "./dto/update-wisdom.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Wisdom } from "src/entities/wisdom.entity";
import { Repository, ILike } from "typeorm";

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

  async findAll(page = 1, limit = 10, search?: string) {
    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (currentPage - 1) * pageSize;

    const query: any = {
      order: { created_at: "DESC" },
      skip: skip,
      take: pageSize,
    };

    if (search) {
      query.where = [
        { description: ILike(`%${search}%`) },
        { written_by: ILike(`%${search}%`) },
      ];
    }

    const [items, total] = await this.wisdomRepository.findAndCount(query);

    return {
      items,
      meta: {
        total,
        page: currentPage,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const wisdom = await this.wisdomRepository.findOne({
      where: { wisdom_id: id },
    });
    if (!wisdom) {
      throw new HttpException("Wisdom not found", HttpStatus.NOT_FOUND);
    }
    return wisdom;
  }

  async updateWisdom(id: string, dto: UpdateWisdomDto) {
    const wisdom = await this.findOne(id);
    Object.assign(wisdom, dto);
    return await this.wisdomRepository.save(wisdom);
  }

  async deleteWisdom(id: string) {
    const result = await this.wisdomRepository.softDelete({ wisdom_id: id });
    if (result.affected === 0) {
      throw new HttpException("Wisdom not found", HttpStatus.NOT_FOUND);
    }
    return;
  }
}
