import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

import { APP_FILTER } from '@nestjs/core';
//import { CustomExceptionFilter } from './filters/custom-exception.filter';

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/user/user.module";
import { WisdomModule } from "./modules/wisdom/wisdom.module";
import { EventsModule } from "./modules/events/events.module";

@Module({
  imports: [

    // ✅ MUST BE FIRST (Loads .env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ✅ MAIL CONFIG
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: JSON.parse(process.env.SMTP_SECURE || "false"),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@pax_africana_support.com>',
      },
      template: {
        dir: process.cwd() + "/src/templates/",
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),

    // ✅ DATABASE CONNECTION
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/entities/*.entity{.ts,.js}"],
      synchronize: true,
    }),

    ScheduleModule.forRoot(),

    AuthModule,
    UsersModule,
    WisdomModule,
    EventsModule,
  ],

  providers: [
  //  {
  //    provide: APP_FILTER,
  //  useClass: CustomExceptionFilter,
  //  },
  ],
})
export class AppModule {}
