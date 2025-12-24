import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { json, urlencoded } from "body-parser";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { CustomExceptionFilter } from "./interceptors/exceptions.filter";
import { logger } from "./logger/winston.logger";
import { SeedsService } from "./seeds/seeds.service";
import { UniqueConstraintFilter } from "./interceptors/unqiueconstraint.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const configService = app.get(ConfigService);
  // Add body parsers
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(
    // new CustomExceptionFilter(),
    new UniqueConstraintFilter()
  );
  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: "*",
  });

  // Add seeders
  if (process.env.npm_lifecycle_event === "seed") {
    const seedsService = app.get(SeedsService);
    await seedsService.seedAll();
  }
  const port = configService.get<number>("PORT");
  await app.listen(port);
  logger.info(`Application is running ▶️ http://localhost:${port}`);
}
bootstrap();
