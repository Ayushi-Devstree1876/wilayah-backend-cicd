import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getApi() {
    return {
      message: "API Working ✅"
    };
  }

}




