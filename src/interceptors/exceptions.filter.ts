import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
// import { ERROR_EMAIL } from "./helper/constant";
import { MailerService } from "@nestjs-modules/mailer";

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly mailerService: MailerService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    // Derive the message code from the status code
    const messageCode = HttpStatus[status] || "DEFAULT";

    // Check if the exception response is an object or string
    const exceptionResponse = exception.getResponse();
    // const errorStack = exception.stack;
    const message =
      typeof exceptionResponse === "object" && "message" in exceptionResponse
        ? exceptionResponse["message"]
        : exceptionResponse;

    // send error email
    // const currentDate = new Date();
    // const formattedDate = currentDate.toLocaleString("en-US", {
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    // });

    // let payload = "";
    // if (Object.keys(request?.body).length) {
    //   for (const [key, value] of Object.entries(request?.body)) {
    //     payload += `"${key}" : "${value}"`;
    //   }
    // }
    // let headers = "";

    // if (Object.keys(request.headers).length) {
    //   for (const [key, value] of Object.entries(request.headers)) {
    //     headers += `"${key}" : "${value}"`;
    //   }
    // }

    // this.mailerService.sendMail({
    //   to: ERROR_EMAIL.email,
    //   subject: `System Error Alert - ${formattedDate}`,
    //   template: `${process.cwd()}/src/templates/error-email.ejs`,
    //   context: {
    //     statusCode: status,
    //     message,
    //     filename: errorStack?.split("\n")[1]?.match(/\((.*):(\d+):(\d+)\)/)?.[1] || null,
    //     line: errorStack?.split("\n")[1]?.match(/\((.*):(\d+):(\d+)\)/)?.[2],
    //     column: errorStack?.split("\n")[1]?.match(/\((.*):(\d+):(\d+)\)/)?.[3],
    //     method: request.method,
    //     url: request.originalUrl,
    //     environment: process.env.NODE_ENV,
    //     errorTime: new Date().toISOString(),
    //     headers: request.headers,
    //     payload: request?.body,
    //     stack: errorStack,
    //     formattedDate,
    //   },
    // });

    response.status(status).json({
      error: true,
      message: Array.isArray(message) ? message[0] : message,
      statusCode: status,
      messageCode: messageCode,
      errorMessage: Array.isArray(message) ? message[0] : message,
      data: [],
    });
  }
}
