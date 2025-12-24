import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuditLogService } from "../auditlog/audit-log.service";
import { Reflector } from "@nestjs/core";
import { map } from "rxjs/operators";
import { Action_Type } from "src/helper/constant";

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user: any = request.user;

    const handler = context.getHandler();
    const action = this.reflector.get<string>("action", handler);

    const entity = context.switchToHttp().getRequest().body;

    let newValue = null;

    if (action === "UPDATE") {
      newValue = entity;
    } else if (action === "DELETE") {
      newValue = null;
    } else if (action === "CREATE") {
      newValue = entity;
    }

    return next.handle().pipe(
      map(async (data) => {
        if (user) {
          // Create the audit log
          await this.auditLogService.createAuditLog(
            action || Action_Type.OTHER,
            data.message,
            newValue,
            user?.user_id,
            user.first_name + " " + user.last_name,
            user.role.name,
            user?.is_proxy ? user.super_user.user_id : null,
            user?.is_proxy
              ? `${user.super_user.first_name} ${user.super_user.last_name}`
              : "self"
          );
        }

        return data;
      })
    );
  }
}
