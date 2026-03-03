import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { INTERNAL_SERVER_ERROR } from "../utils/message";
import { logger } from "../logger/winston.logger";

@Catch(QueryFailedError)
export class UniqueConstraintFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Check if the error is a unique constraint violation
    const isUniqueConstraintError =
      exception.message.includes("unique constraint");

    if (isUniqueConstraintError) {
      response.status(HttpStatus.CONFLICT).json({
        error: true,
        statusCode: HttpStatus.CONFLICT,
        messageCode: HttpStatus.CONFLICT,
        path: request.url,
        message: "A record with the provided value already exists.",
        errorMessage: "A record with the provided value already exists.",
      });
    } else {
      // If it's not a unique constraint error, rethrow the exception
      // throw new HttpException(
      //   exception.message,
      //   HttpStatus.INTERNAL_SERVER_ERROR
      // );
      logger.error(exception.name);
      logger.error(exception.message);
      logger.error(exception.stack);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        messageCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: INTERNAL_SERVER_ERROR,
        errorMessage: INTERNAL_SERVER_ERROR,
        data: [],
      });
    }
  }
}
