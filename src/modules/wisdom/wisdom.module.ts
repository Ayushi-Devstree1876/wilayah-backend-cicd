import { Module } from "@nestjs/common";
import { WisdomService } from "./wisdom.service";
import { WisdomController } from "./wisdom.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wisdom } from "src/entities/wisdom.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wisdom])],
  controllers: [WisdomController],
  providers: [WisdomService],
})
export class WisdomModule {}
