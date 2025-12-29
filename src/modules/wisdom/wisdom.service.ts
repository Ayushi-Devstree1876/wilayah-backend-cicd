import { Injectable } from "@nestjs/common";
import { CreateWisdomDto } from "./dto/create-wisdom.dto";
import { UpdateWisdomDto } from "./dto/update-wisdom.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Wisdom } from "src/entities/wisdom.entity";
import { Repository } from "typeorm";

@Injectable()
export class WisdomService {
  constructor(
    @InjectRepository(Wisdom)
    private wisdomRepository: Repository<Wisdom>
  ) {}

  async addWisdom(createWisdomDto: CreateWisdomDto) {
    const newWisdom = this.wisdomRepository.create(createWisdomDto);
    await this.wisdomRepository.save(newWisdom);
  }
}
