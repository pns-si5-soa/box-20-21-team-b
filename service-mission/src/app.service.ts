import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMissionStatus(): string {
    return 'Mission is ready, get to (╯°□°）╯︵ ┻━┻';
  }
}
