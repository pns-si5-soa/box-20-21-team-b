import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('telemetry')
export class AppController {

  constructor(private readonly appService: AppService) {

  }
}
