import { Controller } from '@nestjs/common';

@Controller('telemetry')
export class AppController {

  ok(): string {
    return 'ok';
  }
}
