import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { CustomExceptionFilter } from "./interceptors/exceptions.filter";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/user/user.module";
import { WisdomModule } from "./modules/wisdom/wisdom.module";

const env = process.env;

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT),
        secure: JSON.parse(env.SMTP_SECURE), // true for 465, false for other ports
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@pax_africana_support.com>',
      },
      template: {
        dir: process.cwd() + "/src/templates/",
        adapter: new EjsAdapter(), // Use EJS adapter
        options: {
          strict: false,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: [__dirname + "/entities/*.entity{.ts,.js}"],
      synchronize: true, // set to false in production
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config globally available
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    WisdomModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
