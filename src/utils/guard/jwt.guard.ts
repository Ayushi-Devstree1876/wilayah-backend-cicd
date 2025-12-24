import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenExpiredError, JsonWebTokenError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { TOKEN_INVALID_EXPIRED, TOKEN_NOT_PROVIDED } from "../message";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err: Error, user: any, info: any) {
    if (info instanceof TokenExpiredError) {
      throw new HttpException(TOKEN_INVALID_EXPIRED, 440);
    } else if (info instanceof JsonWebTokenError) {
      throw new HttpException(TOKEN_INVALID_EXPIRED, 440);
    } else if (!user) {
      throw new UnauthorizedException(TOKEN_NOT_PROVIDED);
    }
    return user;
  }
}
