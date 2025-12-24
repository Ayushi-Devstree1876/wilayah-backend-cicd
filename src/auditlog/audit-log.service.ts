import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditLog } from "./audit-log.entity";

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>
  ) {}

  async createAuditLog(
    action: string,
    message: string,
    newValue: Record<string, any> | null,
    user_id: string,
    name: string,
    role: string,
    perform_user_id: string,
    perform_by: string
  ): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      action,
      message,
      newValue,
      user_id,
      name,
      role,
      perform_user_id,
      perform_by,
    });

    return this.auditLogRepository.save(auditLog);
  }
}
