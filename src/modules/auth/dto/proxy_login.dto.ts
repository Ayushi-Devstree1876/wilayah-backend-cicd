import { IsNotEmpty, IsUUID } from "class-validator";

export class ProxyLoginDto {
  @IsUUID()
  @IsNotEmpty({ message: "Proxy user id is required" })
  user_id: string;
}
