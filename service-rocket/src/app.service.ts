import { Injectable, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MISSION_HOST, MISSION_PORT, } from './env_variables';


@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  getStatus(): string {
    return 'Rocket is ready to take off !';
  }

}
